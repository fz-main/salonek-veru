import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SITE } from '../data/site';
import { STAGES } from '../data/services';

// Фон как в исходном шаблоне, один неспешный сценарий:
//  1) заставка — первый кадр видео едва виден;
//  2) при первой прокрутке видео проигрывается ОДИН раз;
//  3) последний кадр замирает (стоп-кадр);
//  4) кадр плавно размывается и затемняется и остаётся фоном;
//  5) затем плавно появляются услуги.
// Если видео не загрузилось, работает запасной фон — плывущие фото салона.
// Видео лежит в проекте: public/videos/bg.mp4 и bg.webm (кадры из шаблона).
const BG_MP4_URL = `${import.meta.env.BASE_URL}videos/bg.mp4`;
const BG_WEBM_URL = `${import.meta.env.BASE_URL}videos/bg.webm`;

const SLIDES = [
  SITE.images.hero,
  ...SITE.images.gallery.slice(1, 8).map((g) => g.src),
];
const SLIDE_MS = 7000;
const START_TIMEOUT_MS = 6000;

// тайминг после конца видео (мс)
const HOLD_MS = 800; // стоп-кадр без изменений
const BLUR_MS = 3800; // длительность размытия и затемнения
const MENU_AFTER_BLUR_MS = 2600; // когда после начала размытия появляются услуги

type Mode = 'video' | 'canvas' | 'photos';
type End = 'none' | 'frozen' | 'blurred';

// Необязательная замена видео: покадровое проигрывание на canvas. Нужно только в превью внутри чата,
// где встроенный просмотрщик блокирует <video>; в обычной сборке window.__bgAnim не задан.
interface BgAnim { frames: string[]; fps: number }
const getAnim = (): BgAnim | undefined =>
  typeof window === 'undefined' ? undefined : (window as unknown as { __bgAnim?: BgAnim }).__bgAnim;

interface BackgroundProps {
  stage: number;
  onVideoEnd: () => void;
  onVideoFail: () => void;
}

export default function Background({ stage, onVideoEnd, onVideoFail }: BackgroundProps) {
  const anim = getAnim();
  const [mode, setMode] = useState<Mode>('video');
  const [end, setEnd] = useState<End>('none');
  const [ready, setReady] = useState(false);
  const [index, setIndex] = useState(0);
  const [failedImgs, setFailedImgs] = useState<Set<string>>(new Set());
  const [diag, setDiag] = useState('');

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const requestedRef = useRef(false); // проигрывание уже запрашивали — второй раз не запускаем никогда
  const startedRef = useRef(false);
  const finishedRef = useRef(false);
  const [starts, setStarts] = useState(0); // сколько раз запускалось проигрывание (для отладки; должно быть 1)
  const timersRef = useRef<number[]>([]);

  const intro = stage === STAGES.INTRO;
  const playingStage = stage === STAGES.VIDEO;
  const slides = SLIDES.filter((s) => !failedImgs.has(s));
  const current = slides.length ? slides[index % slides.length] : null;

  const describe = (reason: string) => {
    const el = videoRef.current;
    const can = (t: string) => (el ? el.canPlayType(t) || 'no' : '?');
    return `video: ${reason} | mp4=${can('video/mp4; codecs="avc1.42E01E"')} webm=${can('video/webm; codecs="vp9"')} | net=${el?.networkState} ready=${el?.readyState} err=${el?.error?.code ?? '-'}`;
  };

  // видео (или его покадровая замена) не заиграло
  const fail = (reason: string) => {
    if (finishedRef.current || startedRef.current) return;
    setDiag(describe(reason));
    requestedRef.current = false; // ничего не проигрывалось — замена вправе запуститься
    if (anim) setMode('canvas');
    else setMode('photos');
  };

  // конец проигрывания: стоп-кадр → размытие и затемнение → появление услуг. Срабатывает строго один раз.
  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    setEnd('frozen');
    const t1 = window.setTimeout(() => setEnd('blurred'), HOLD_MS);
    const t2 = window.setTimeout(onVideoEnd, HOLD_MS + MENU_AFTER_BLUR_MS);
    timersRef.current.push(t1, t2);
  }, [onVideoEnd]);

  useEffect(() => () => timersRef.current.forEach((t) => window.clearTimeout(t)), []);

  // без видео и без покадровой замены — сразу услуги (как только запросили проигрывание)
  useEffect(() => {
    if (mode === 'photos' && playingStage) onVideoFail();
  }, [mode, playingStage, onVideoFail]);

  // слайдшоу (запасной фон)
  useEffect(() => {
    if (mode !== 'photos' || slides.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), SLIDE_MS);
    return () => clearInterval(id);
  }, [mode, slides.length]);

  // ---------- проигрывание <video> ----------
  useEffect(() => {
    if (mode !== 'video' || !playingStage || requestedRef.current) return;
    const el = videoRef.current;
    if (!el) return;
    requestedRef.current = true;
    el.currentTime = 0;
    el.play().catch((e: unknown) => fail(`play() rejected: ${e instanceof Error ? e.name : String(e)}`));
    // если видео так и не пошло (медленная сеть) — не держим посетителя на пустом экране
    const timer = window.setTimeout(() => {
      if (!startedRef.current) fail('did not start in time');
    }, START_TIMEOUT_MS);
    timersRef.current.push(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, playingStage]);

  // ---------- покадровая замена (только превью в чате) ----------
  const drawFrame = (i: number) => {
    const c = canvasRef.current;
    const img = framesRef.current[i];
    if (!c || !img || !img.complete || !img.naturalWidth) return false;
    if (c.width !== img.naturalWidth) { c.width = img.naturalWidth; c.height = img.naturalHeight; }
    c.getContext('2d')?.drawImage(img, 0, 0);
    return true;
  };

  // загрузка кадров и показ первого кадра на заставке
  useEffect(() => {
    if (!anim || mode !== 'canvas' || framesRef.current.length) return;
    framesRef.current = anim.frames.map((src, i) => {
      const im = new Image();
      if (i === 0) im.onload = () => drawFrame(0);
      im.src = src;
      return im;
    });
  }, [anim, mode]);

  // воспроизведение кадров: один раз от первого до последнего, дальше стоп-кадр
  useEffect(() => {
    if (!anim || mode !== 'canvas' || !playingStage || requestedRef.current) return;
    requestedRef.current = true;
    startedRef.current = true;
    const n = anim.frames.length;
    const tStart = performance.now();
    let t0 = tStart;
    let last = 0;
    let began = false;
    const tick = () => {
      if (!began) { began = true; setStarts((c) => c + 1); }
      // ждём, пока кадры декодируются (не дольше 3 с), чтобы не пропускать начало
      if (performance.now() - tStart < 3000 && !framesRef.current.every((im) => im.complete)) {
        t0 = performance.now();
        requestAnimationFrame(tick);
        return;
      }
      const i = Math.min(n - 1, Math.floor(((performance.now() - t0) / 1000) * anim.fps));
      for (let k = i; k >= last; k--) if (drawFrame(k)) { last = k; break; }
      if (i >= n - 1) { finish(); return; }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anim, mode, playingStage]);

  // ---------- вид фона ----------
  // размытие и затемнение: после стоп-кадра, а также во всех сценах после интро/видео
  const soft = end === 'blurred' || (!intro && !playingStage);
  const mediaStyle: React.CSSProperties = soft
    ? { filter: 'blur(12px) brightness(0.95)', opacity: 0.72, transform: 'scale(1.06)' }
    : playingStage || end === 'frozen'
      ? { filter: 'blur(0px) brightness(1)', opacity: 1, transform: 'none' }
      : { filter: 'blur(2px) brightness(1)', opacity: ready ? 0.45 : 0, transform: 'none' };
  const mediaClass = 'absolute inset-0 w-full h-full object-cover';
  const mediaTransition = soft
    ? `filter ${BLUR_MS}ms ease-in-out, opacity ${BLUR_MS}ms ease-in-out, transform ${BLUR_MS + 1200}ms ease-out`
    : 'filter 1.2s ease-in-out, opacity 0.6s ease-in-out, transform 1.2s ease-in-out';

  return (
    <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden bg-[#1c1512]">
      {/* тёплое анимированное свечение — работает и без фото/видео */}
      <div className="bg-glow absolute inset-0" />

      {/* запасной фон: фото салона */}
      {mode === 'photos' && (
        <div
          className="absolute inset-0"
          style={{
            transition: 'filter 1.8s ease-in-out, opacity 1.8s ease-in-out',
            filter: intro ? 'blur(3px)' : 'blur(9px)',
            opacity: intro ? 0.6 : 0.8,
          }}
        >
          <AnimatePresence>
            {current && (
              <motion.img
                key={current}
                src={current}
                alt=""
                referrerPolicy="no-referrer"
                onError={() => setFailedImgs((f) => new Set(f).add(current))}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2 }}
                className="kenburns absolute inset-0 w-full h-full object-cover"
              />
            )}
          </AnimatePresence>
        </div>
      )}

      {/* видео из шаблона */}
      {mode === 'video' && (
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          loop={false}
          onLoadedData={(e) => {
            // показываем первый кадр на заставке
            if (e.currentTarget.paused && e.currentTarget.currentTime === 0) e.currentTarget.currentTime = 0.001;
            setReady(true);
          }}
          onPlaying={() => {
            if (!startedRef.current) setStarts((c) => c + 1);
            startedRef.current = true;
          }}
          onEnded={(e) => { e.currentTarget.pause(); finish(); }}
          onError={() => fail('video error')}
          className={mediaClass}
          style={{ transition: mediaTransition, ...mediaStyle }}
        >
          {/* браузер выберет первый поддерживаемый формат: WebM (VP9), иначе MP4 (H.264) */}
          <source src={BG_WEBM_URL} type='video/webm; codecs="vp9"' />
          <source src={BG_MP4_URL} type='video/mp4; codecs="avc1.42E01E"' onError={() => fail('no playable source')} />
        </video>
      )}

      {/* покадровая замена видео (только превью в чате) */}
      {mode === 'canvas' && (
        <canvas ref={canvasRef} className={mediaClass} style={{ transition: mediaTransition, ...mediaStyle }} />
      )}

      {/* затемнение, чтобы текст читался; пока идёт видео — минимальное, после стоп-кадра — плотное */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.22) 35%, rgba(0,0,0,0.3) 65%, rgba(0,0,0,0.55))',
          transition: `opacity ${soft ? BLUR_MS : 1200}ms ease-in-out`,
          opacity: soft || intro ? 1 : 0.35,
        }}
      />

      {/* диагностика: показывается только в отладочной сборке превью (data-debug) */}
      {typeof document !== 'undefined' && document.documentElement.dataset.debug && (
        <div className="fixed bottom-2 left-2 right-2 z-[300] text-[10px] leading-snug text-white/80 bg-black/70 rounded px-2 py-1 font-mono">
          {`mode=${mode} stage=${stage} end=${end} starts=${starts}`}{diag ? ` | ${diag}` : ''}
        </div>
      )}
    </div>
  );
}
