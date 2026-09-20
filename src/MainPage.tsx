import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { STAGES, SERVICES, CATEGORIES } from './data/services';
import type { Service } from './data/services';
import { SITE, MASTERS } from './data/site';
import { translations, LANGS } from './lib/i18n';
import type { Lang, Translations } from './lib/i18n';
import ServiceDetail from './components/ServiceDetail';
import MenuButton from './components/MenuButton';
import Testimonials from './components/Testimonials';
import InertiaGallery from './components/InertiaGallery';
import Background from './components/Background';

const COOLDOWN = 900;

const letterVariants = {
  hidden: { opacity: 0, y: 80, filter: 'blur(20px)', scale: 0.8 },
  visible: (i: number) => ({
    opacity: 1, y: 0, filter: 'blur(0px)', scale: 1,
    transition: { delay: 0.3 + i * 0.06, duration: 1, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
};

export default function MainPage() {
  const [lang, setLang] = useState<Lang>('cs');
  const t = translations[lang];

  const [stage, setStage] = useState(STAGES.INTRO);
  const [activeService, setActiveService] = useState<Service | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const lastScrollTime = useRef(0);

  useEffect(() => { document.documentElement.lang = lang; }, [lang]);

  // Первая прокрутка запускает фоновое видео (как в шаблоне). Когда оно доиграло и начало
  // размываться — плавно появляются услуги. Если видео не пошло — сразу показываем услуги.
  const startVideo = () => setStage((s) => (s === STAGES.INTRO ? STAGES.VIDEO : s));
  const toMenuFromVideo = () => setStage((s) => (s === STAGES.VIDEO ? STAGES.MENU : s));
  const handleVideoEnd = useCallback(() => { toMenuFromVideo(); }, []);
  const handleVideoFail = useCallback(() => { toMenuFromVideo(); }, []);

  const openService = (service: Service) => {
    setActiveService(service);
    setStage(STAGES.SERVICE_DETAIL);
  };
  const closeService = () => {
    setStage(STAGES.MENU);
    setTimeout(() => setActiveService(null), 400);
  };

  useEffect(() => {
    // Переходы между сценами колесом/свайпом:
    //  • интро → меню — сразу;
    //  • меню → «О нас» и «О нас» → меню — только если жест НАЧАЛСЯ уже у края страницы
    //    (докрутил до конца, остановился, и потом ещё раз протянул в ту же сторону).
    //    Инерция того же жеста, которым докрутили до края, переход не вызывает.
    const scroller = () =>
      document.getElementById(stage === STAGES.MENU ? 'menu-scroll' : stage === STAGES.ABOUT ? 'about-scroll' : '');
    const edge = (dir: 1 | -1) => {
      const el = scroller();
      if (!el) return false;
      return dir > 0 ? el.scrollTop + el.clientHeight >= el.scrollHeight - 2 : el.scrollTop <= 1;
    };
    // куда ведёт жест в конкретной сцене (dir: 1 — вниз, -1 — вверх)
    const go = (dir: 1 | -1) => {
      const now = Date.now();
      if (now - lastScrollTime.current < COOLDOWN) return;
      if (stage === STAGES.INTRO && dir > 0) startVideo();
      else if (stage === STAGES.MENU && dir > 0) setStage(STAGES.ABOUT);
      else if (stage === STAGES.ABOUT && dir < 0) setStage(STAGES.MENU);
      else return;
      lastScrollTime.current = now;
    };
    const needsEdge = stage !== STAGES.INTRO;

    let lastWheel = 0;
    let gestureAtEdge = false;
    let acc = 0;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 2) return;
      const dir: 1 | -1 = e.deltaY > 0 ? 1 : -1;
      const now = Date.now();
      if (now - lastWheel > 350) {
        // новый жест: запоминаем, были ли мы у края в его начале
        gestureAtEdge = !needsEdge || edge(dir);
        acc = 0;
      }
      lastWheel = now;
      if (!gestureAtEdge) return;
      acc += Math.abs(e.deltaY);
      if (acc > (needsEdge ? 120 : 4)) { go(dir); acc = 0; }
    };

    let touchStartY = 0;
    let touchAtBottom = false;
    let touchAtTop = false;
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      touchAtBottom = edge(1);
      touchAtTop = edge(-1);
    };
    const onTouchEnd = (e: TouchEvent) => {
      const delta = touchStartY - e.changedTouches[0].clientY; // > 0 — свайп вверх, т.е. листаем вниз
      if (Math.abs(delta) < 60) return;
      const dir: 1 | -1 = delta > 0 ? 1 : -1;
      if (!needsEdge || (dir > 0 ? touchAtBottom : touchAtTop)) go(dir);
    };

    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [stage]);

  return (
    <div className="w-screen h-screen bg-[#0a0a0a] text-[#f8f5f2] overflow-hidden relative selection:bg-accent selection:text-black">
      {lightboxImage && (
        <div className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center cursor-pointer" onClick={() => setLightboxImage(null)}>
          <img src={lightboxImage} alt="" className="max-w-[90vw] max-h-[90vh] object-contain" referrerPolicy="no-referrer" />
          <button className="absolute top-4 right-4 text-white text-4xl" aria-label="Close">&times;</button>
        </div>
      )}

      <Background stage={stage} onVideoEnd={handleVideoEnd} onVideoFail={handleVideoFail} />

      <div className="absolute inset-0 z-10 pointer-events-none">
        <Header t={t} lang={lang} setLang={setLang} stage={stage} goAbout={() => setStage(STAGES.ABOUT)} goMenu={() => { setActiveService(null); setStage(STAGES.MENU); }} />

        <AnimatePresence mode="wait">
          {stage === STAGES.INTRO && (
            <motion.div key="intro" exit={{ opacity: 0, filter: 'blur(20px)', scale: 1.1 }} transition={{ duration: 0.8, ease: 'easeInOut' }} className="absolute inset-0 flex flex-col items-center justify-center px-4">
              <div className="text-center">
                <div className="overflow-hidden">
                  {'SALONEK'.split('').map((char, i) => (
                    <motion.span key={`s${i}`} custom={i} variants={letterVariants} initial="hidden" animate="visible" className="font-editorial text-[16vw] sm:text-[12vw] md:text-[9vw] leading-none tracking-tighter inline-block">{char}</motion.span>
                  ))}
                </div>
                <div className="overflow-hidden">
                  <motion.span custom={7} variants={letterVariants} initial="hidden" animate="visible" className="font-editorial italic text-[7vw] sm:text-[5vw] md:text-[2.6vw] leading-none tracking-wider text-accent inline-block">{t.location}</motion.span>
                </div>
                <div className="overflow-hidden">
                  {'VERU'.split('').map((char, i) => (
                    <motion.span key={`v${i}`} custom={i + 8} variants={letterVariants} initial="hidden" animate="visible" className="font-editorial text-[16vw] sm:text-[12vw] md:text-[9vw] leading-none tracking-tighter inline-block">{char}</motion.span>
                  ))}
                </div>
              </div>
              <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 1 }} className="font-montreal text-[11px] md:text-sm text-[#c9c9c9] tracking-widest uppercase mt-8 text-center">{t.tagline}</motion.p>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6, duration: 2 }} className="flex flex-col items-center mt-10">
                <span className="font-montreal text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-[#a3a3a3] mb-3 md:mb-4">{t.scrollToEnter}</span>
                <div className="w-[1px] h-10 md:h-12 bg-white/20 overflow-hidden relative">
                  <motion.div animate={{ y: ['-100%', '100%'] }} transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }} className="absolute inset-0 bg-white" />
                </div>
                <button onClick={startVideo} className="mt-6 px-6 py-3 border border-accent/60 rounded-full font-montreal text-[10px] md:text-xs uppercase tracking-widest text-accent hover:bg-accent hover:text-black transition-all pointer-events-auto">{t.scrollToServices}</button>
              </motion.div>
            </motion.div>
          )}

          {stage === STAGES.MENU && (
            <motion.div key="menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }} className="absolute inset-0 pointer-events-auto z-[5]">
              <div id="menu-scroll" className="w-full h-full overflow-y-auto" style={{ touchAction: 'pan-y' }}>
                <div className="px-3 md:px-10 pt-24 md:pt-[110px] pb-6 max-w-6xl mx-auto">
                  <div className="text-center mb-8">
                    <div className="font-monument text-[9px] md:text-[11px] tracking-[0.3em] text-accent uppercase mb-2">{t.categoriesLabel}</div>
                    <h2 className="font-editorial text-2xl md:text-4xl">{t.servicesTitle}</h2>
                  </div>

                  {CATEGORIES.map((cat) => (
                    <div key={cat.id} className="mb-8">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="h-px flex-1 bg-white/10" />
                        <div className="font-monument text-[9px] md:text-[10px] tracking-[0.3em] text-white/50">{cat.title[lang]}</div>
                        <div className="h-px flex-1 bg-white/10" />
                      </div>
                      <div className="flex flex-wrap justify-center gap-x-3 gap-y-2 md:gap-x-6 w-full">
                        {SERVICES.filter((s) => s.category === cat.id).map((srv, i) => (
                          <motion.div key={srv.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.03 }}>
                            <MenuButton title={srv.shortTitle[lang]} subtitle={srv.subtitle[lang]} onClick={() => openService(srv)} enterLabel={t.enterModule} />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ))}

                  <div className="flex justify-center mt-6">
                    <button onClick={() => setStage(STAGES.ABOUT)} className="px-6 py-3 border border-white/25 rounded-full font-monument text-[9px] tracking-widest text-white/70 hover:border-accent hover:text-accent transition-colors">{t.aboutLabel} ↓</button>
                  </div>
                </div>

                <ContactsCompact t={t} lang={lang} />
              </div>
            </motion.div>
          )}

          {stage === STAGES.ABOUT && (
            <motion.div key="about" initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 60 }} transition={{ duration: 0.8, ease: 'easeOut' }} className="absolute inset-0 pointer-events-auto z-[5]">
              <div id="about-scroll" className="w-full h-full overflow-y-auto px-6 pt-24 pb-10" style={{ touchAction: 'pan-y' }}>
                <button onClick={() => setStage(STAGES.MENU)} className="fixed top-16 md:top-20 left-4 md:left-8 font-monument text-[10px] md:text-xs tracking-widest hover:text-accent transition-colors z-50 flex items-center gap-3 group bg-black/60 px-3 py-2 rounded-full backdrop-blur-sm">
                  <span className="w-4 h-[1px] bg-white group-hover:bg-accent transition-colors" />
                  {t.back}
                </button>

                <div className="max-w-5xl w-full mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
                    <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }} className="flex justify-center cursor-pointer" onClick={() => setLightboxImage(SITE.images.about)}>
                      <img src={SITE.images.about} alt="Salonek Veru" style={{ width: 'min(100%, 28rem, 56vh)' }} className="aspect-[3/4] object-cover rounded-3xl shadow-2xl transition-transform hover:scale-105" />
                    </motion.div>
                    <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.35, ease: 'easeOut' }}>
                      <div className="font-monument text-[9px] tracking-[0.3em] text-accent mb-4 uppercase">{t.aboutLabel}</div>
                      <h2 className="font-editorial text-4xl md:text-5xl mb-2 leading-tight">{t.aboutHeading}</h2>
                      <div className="font-montreal text-xs text-[#a3a3a3] tracking-widest mb-6">{t.aboutFounder}</div>
                      <div className="border-t border-white/10 pt-6 flex flex-col gap-4">
                        {t.aboutBio.split('\n\n').map((p, i) => (
                          <p key={i} className="font-montreal text-sm text-[#b5b5b5] leading-relaxed">{p}</p>
                        ))}
                        <p className="font-montreal text-sm leading-relaxed text-accent">{t.aboutMotto}</p>
                        <div className="font-monument text-[9px] tracking-widest text-[#a3a3a3] mt-2">{t.aboutServices}</div>
                      </div>
                    </motion.div>
                  </div>

                  {/* команда */}
                  <div className="mt-20">
                    <div className="text-center mb-8 font-monument text-[9px] tracking-[0.3em] text-accent uppercase">{t.mastersTitle}</div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {Object.values(MASTERS).map((m) => (
                        <div key={m.id} className="glass-panel rounded-3xl p-6 text-center flex flex-col items-center">
                          <div className="w-14 h-14 rounded-full border border-accent/60 text-accent font-editorial text-2xl flex items-center justify-center mb-4">{m.name[0]}</div>
                          <div className="font-editorial text-2xl">{m.name}</div>
                          <div className="font-montreal text-xs text-white/55 leading-relaxed mt-2 mb-4">{m.role[lang]}{m.note ? ` · ${m.note[lang]}` : ''}</div>
                          <a href={`tel:${m.tel}`} className="mt-auto px-5 py-2.5 bg-accent text-black font-monument text-[10px] tracking-widest rounded-full hover:bg-white transition-colors">{m.phone}</a>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Testimonials lang={lang} t={t} />

                  <div className="w-full mt-6"><InertiaGallery t={t} lang={lang} onOpen={setLightboxImage} /></div>

                  <ContactsFull t={t} lang={lang} />
                </div>
              </div>
            </motion.div>
          )}

          {stage === STAGES.SERVICE_DETAIL && activeService && (
            <ServiceDetail key="detail" service={activeService} onBack={closeService} lang={lang} t={t} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Header({ t, lang, setLang, stage, goAbout, goMenu }: {
  t: Translations; lang: Lang; setLang: (l: Lang) => void; stage: number; goAbout: () => void; goMenu: () => void;
}) {
  return (
    <header className="absolute top-0 left-0 w-full px-6 py-5 md:px-8 md:py-8 flex justify-between items-center z-50 mix-blend-difference pointer-events-auto">
      <button onClick={goMenu} className="font-monument text-[10px] md:text-xs tracking-[0.2em] text-left">SALONEK VERU</button>
      <div className="flex items-center gap-3 md:gap-5">
        {(stage === STAGES.MENU || stage === STAGES.SERVICE_DETAIL) && (
          <button onClick={goAbout} className="hidden md:block font-monument text-[9px] tracking-widest text-white/60 hover:text-white transition-colors uppercase">{t.aboutLabel}</button>
        )}
        <div className="flex items-center gap-1">
          {LANGS.map((l) => (
            <button key={l} onClick={() => setLang(l)} className={`font-monument text-[9px] md:text-[10px] tracking-wider px-2 py-1 rounded-full transition-all ${lang === l ? 'bg-white text-black' : 'text-white/60 hover:text-white'}`}>{l.toUpperCase()}</button>
          ))}
        </div>
        <div className="hidden sm:block font-montreal text-[10px] md:text-xs uppercase tracking-widest">Praha 7</div>
      </div>
    </header>
  );
}

function SocialLinks({ t }: { t: Translations }) {
  const cls = 'font-monument text-[9px] tracking-widest text-white/50 hover:text-accent transition-colors uppercase';
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 mt-1">
      <a href={SITE.facebook} target="_blank" rel="noopener noreferrer" className={cls}>Facebook</a>
      <span className="text-white/20">·</span>
      <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" className={cls}>Instagram</a>
      <span className="text-white/20">·</span>
      <a href={SITE.privacyUrl} target="_blank" rel="noopener noreferrer" className={cls}>{t.privacy}</a>
    </div>
  );
}

function ContactsCompact({ t, lang }: { t: Translations; lang: Lang }) {
  const v = MASTERS.veronika;
  return (
    <div className="flex flex-col items-center gap-0.5 text-center px-4 py-5" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="font-monument text-[8px] tracking-[0.25em] text-accent uppercase mb-1">{t.contactsTitle}</div>
      <div className="font-montreal text-[11px] text-white/70">{SITE.address[lang]}</div>
      <div className="font-montreal text-[11px] text-white/70 flex flex-wrap justify-center gap-x-2">
        <a href={`tel:${v.tel}`} className="hover:text-accent transition-colors">+420 {v.phone}</a>
        <span className="text-white/30">·</span>
        <a href={`mailto:${SITE.email}`} className="hover:text-accent transition-colors">{SITE.email}</a>
      </div>
      <div className="font-montreal text-[10px] text-white/45 mt-1">{t.byAppointment}</div>
      <SocialLinks t={t} />
    </div>
  );
}

function ContactsFull({ t, lang }: { t: Translations; lang: Lang }) {
  return (
    <div className="w-full mt-14 pt-8 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="font-monument text-[10px] tracking-[0.25em] text-accent uppercase mb-6">{t.contactsTitle}</div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-8">
        {Object.values(MASTERS).map((m) => (
          <div key={m.id} className="font-montreal text-xs text-white/70">
            <div className="font-editorial text-lg text-white">{m.name}</div>
            <div className="text-white/45 mb-1">{m.role[lang]}{m.note ? ` (${m.note[lang]})` : ''}</div>
            <a href={`tel:${m.tel}`} className="hover:text-accent transition-colors">{t.ordersWith}: {m.phone}</a>
          </div>
        ))}
      </div>
      <div className="font-montreal text-xs text-white/50 mb-1">{t.contactAddressLabel}</div>
      <div className="font-montreal text-sm text-white/85">Salonek Veru</div>
      <div className="font-montreal text-sm text-white/85">{SITE.address[lang]}</div>
      <div className="font-montreal text-sm text-white/85 mt-1">
        <a href={`mailto:${SITE.email}`} className="hover:text-accent transition-colors">{SITE.email}</a>
      </div>
      <div className="font-montreal text-xs text-white/50 mt-3">{t.byAppointment}</div>
      <div className="font-montreal text-xs text-white/50">{t.cashOnly}</div>
      <a href={SITE.mapUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-5 px-6 py-3 border border-accent/60 text-accent font-monument text-[10px] tracking-widest rounded-full hover:bg-accent hover:text-black transition-colors">{t.showOnMap} ↗</a>
      <div className="mt-6"><SocialLinks t={t} /></div>
      <div className="font-montreal text-[10px] text-white/30 mt-6">© {new Date().getFullYear()} Salonek Veru</div>
    </div>
  );
}
