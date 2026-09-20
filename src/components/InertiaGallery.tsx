import { useCallback, useEffect, useRef, useState } from 'react';
import type { Lang } from '../data/site';
import { SITE } from '../data/site';
import type { Translations } from '../lib/i18n';

// Галерея-«карусель» в 3D: карточки стоят по кругу, круг вращается перетаскиванием и
// после отпускания продолжает вращаться по инерции, затем мягко «прилипает» к ближайшему кадру.
// Вращение считается напрямую в DOM (без ререндеров React), чтобы было плавно.

interface InertiaGalleryProps {
  t: Translations;
  lang: Lang;
  onOpen?: (src: string) => void;
}

const DRAG_DEG_PER_PX = 0.32; // на сколько градусов поворачивается круг за 1 px перетаскивания
const FRICTION = 0.95; // затухание инерции за кадр (60 fps): ближе к 1 — дольше катится
const SNAP = true; // после остановки доводить до ближайшей карточки

const norm180 = (a: number) => ((((a + 180) % 360) + 360) % 360) - 180;

export default function InertiaGallery({ t, lang, onOpen }: InertiaGalleryProps) {
  const items = SITE.images.gallery;
  const n = items.length;
  const step = 360 / n;

  const [vw, setVw] = useState(() => (typeof window === 'undefined' ? 1024 : window.innerWidth));
  useEffect(() => {
    const on = () => setVw(window.innerWidth);
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);
  const cardW = Math.round(Math.min(230, Math.max(150, vw * 0.3)));
  const cardH = Math.round(cardW * 1.3);
  const radius = Math.round((cardW / 2 / Math.tan(Math.PI / n)) * 1.18);

  const ringRef = useRef<HTMLDivElement>(null);
  const shadeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const s = useRef({
    rot: 0, // текущий поворот, градусы
    vel: 0, // скорость, градусов/мс
    target: null as number | null, // куда доводим (прилипание/стрелки)
    dragging: false,
    lastX: 0,
    lastT: 0,
    startX: 0,
    moved: 0,
    running: false,
    lastFrame: 0,
    raf: 0,
  });

  const render = useCallback(() => {
    const st = s.current;
    if (ringRef.current) ringRef.current.style.transform = `translateZ(${-radius}px) rotateY(${st.rot}deg)`;
    for (let i = 0; i < n; i++) {
      const el = shadeRefs.current[i];
      if (!el) continue;
      const a = norm180(i * step + st.rot); // 0 — карточка спереди, ±180 — сзади
      const c = (Math.cos((a * Math.PI) / 180) + 1) / 2; // 1 спереди … 0 сзади
      el.style.opacity = String(0.7 * (1 - c));
    }
    const idx = ((Math.round(-st.rot / step) % n) + n) % n;
    if (idx !== activeRef.current) {
      activeRef.current = idx;
      setActive(idx);
    }
  }, [n, step, radius]);

  const loopRef = useRef<(now: number) => void>(() => {});
  const loop = useCallback(
    (now: number) => {
      const st = s.current;
      const dt = Math.min(40, now - st.lastFrame || 16);
      st.lastFrame = now;
      if (!st.dragging) {
        if (st.target !== null) {
          const diff = st.target - st.rot;
          st.rot += diff * (1 - Math.exp(-dt / 110));
          if (Math.abs(diff) < 0.02) { st.rot = st.target; st.target = null; }
        } else {
          st.rot += st.vel * dt;
          st.vel *= Math.pow(FRICTION, dt / 16.7);
          if (Math.abs(st.vel) < 0.008) {
            st.vel = 0;
            if (SNAP) st.target = Math.round(st.rot / step) * step;
          }
        }
        render();
        if (st.target === null && st.vel === 0) { st.running = false; return; }
      }
      st.raf = requestAnimationFrame((t2) => loopRef.current(t2));
    },
    [render, step],
  );
  useEffect(() => { loopRef.current = loop; }, [loop]);

  const kick = useCallback(() => {
    const st = s.current;
    if (st.running) return;
    st.running = true;
    st.lastFrame = performance.now();
    st.raf = requestAnimationFrame((t2) => loopRef.current(t2));
  }, []);

  useEffect(() => {
    render();
    const st = s.current;
    return () => { cancelAnimationFrame(st.raf); st.running = false; };
  }, [render]);

  const onPointerDown = (e: React.PointerEvent) => {
    const st = s.current;
    st.dragging = true;
    st.target = null;
    st.vel = 0;
    st.lastX = st.startX = e.clientX;
    st.lastT = performance.now();
    st.moved = 0;
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const st = s.current;
    if (!st.dragging) return;
    const now = performance.now();
    const dx = e.clientX - st.lastX;
    const dt = Math.max(1, now - st.lastT);
    st.moved += Math.abs(dx);
    st.rot += dx * DRAG_DEG_PER_PX;
    st.vel = st.vel * 0.7 + ((dx * DRAG_DEG_PER_PX) / dt) * 0.3; // сглаженная скорость руки
    st.lastX = e.clientX;
    st.lastT = now;
    render();
  };
  const goTo = (idx: number) => {
    const st = s.current;
    const delta = norm180(-idx * step - st.rot);
    st.target = st.rot + delta;
    st.vel = 0;
    kick();
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const st = s.current;
    if (!st.dragging) return;
    st.dragging = false;
    if (st.moved < 6) {
      // это был тап: по центральной карточке — открыть фото, по боковой — повернуть к ней
      st.vel = 0;
      const hit = document.elementFromPoint(e.clientX, e.clientY)?.closest('[data-idx]');
      const idx = hit ? Number(hit.getAttribute('data-idx')) : NaN;
      if (!Number.isNaN(idx)) {
        if (idx === activeRef.current) onOpen?.(items[idx].src);
        else goTo(idx);
        return;
      }
      st.target = Math.round(st.rot / step) * step;
    } else if (performance.now() - st.lastT > 90) {
      st.vel = 0; // перед отпусканием рука остановилась — инерции нет
    }
    kick();
  };
  const onWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return; // вертикальная прокрутка страницы не трогаем
    const st = s.current;
    st.target = null;
    st.vel += -e.deltaX * 0.004;
    kick();
  };
  const arrow = (dir: 1 | -1) => {
    const st = s.current;
    const base = st.target ?? Math.round(st.rot / step) * step;
    st.target = base - dir * step;
    st.vel = 0;
    kick();
  };

  const arrowStyle: React.CSSProperties = {
    width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.2)', color: 'white', fontSize: 18, cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  };

  return (
    <div style={{ width: '100%', padding: '20px 0' }}>
      <div className="text-center mb-2">
        <div className="font-monument text-[9px] tracking-[0.3em] text-accent uppercase">{t.galleryTitle}</div>
      </div>
      <div
        style={{
          position: 'relative', width: '100%', height: cardH + 90, overflow: 'hidden',
          perspective: 1300, perspectiveOrigin: '50% 42%', touchAction: 'pan-y',
          cursor: 'grab', userSelect: 'none',
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onWheel={onWheel}
      >
        <div
          ref={ringRef}
          style={{
            position: 'absolute', left: '50%', top: 45, width: 0, height: cardH, transformStyle: 'preserve-3d',
            willChange: 'transform',
          }}
        >
          {items.map((item, i) => (
            <div
              key={item.src}
              data-idx={i}
              style={{
                position: 'absolute', width: cardW, height: cardH, left: -cardW / 2, top: 0,
                borderRadius: 22, overflow: 'hidden', boxShadow: '0 18px 36px rgba(0,0,0,0.5)',
                transform: `rotateY(${i * step}deg) translateZ(${radius}px)`,
                background: '#1a1512',
              }}
            >
              <img
                src={item.src}
                alt={item.alt[lang]}
                draggable={false}
                className="w-full h-full object-cover pointer-events-none"
              />
              {/* затемнение карточек, которые повёрнуты к нам спиной */}
              <div
                ref={(el) => { shadeRefs.current[i] = el; }}
                className="absolute inset-0 pointer-events-none"
                style={{ background: '#0c0908', opacity: i === 0 ? 0 : 0.7 }}
              />
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 8 }}>
        <button onClick={() => arrow(-1)} style={arrowStyle} aria-label="←">←</button>
        <button onClick={() => arrow(1)} style={arrowStyle} aria-label="→">→</button>
      </div>
      <div className="text-center mt-3 font-montreal text-[10px] text-white/40">
        <div>{active + 1} / {n}</div>
        <div className="mt-1 tracking-wide">{t.galleryHint}</div>
      </div>
    </div>
  );
}
