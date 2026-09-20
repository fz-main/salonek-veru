import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Lang } from '../data/site';
import { SITE } from '../data/site';
import { REVIEWS } from '../data/reviews';
import type { Translations } from '../lib/i18n';

interface TestimonialsProps {
  lang: Lang;
  t: Translations;
}

const initials = (name: string) =>
  name.split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? '').join('');

export default function Testimonials({ lang, t }: TestimonialsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const total = REVIEWS.length;
  const active = REVIEWS[activeIndex];

  const go = (idx: number) => {
    if (idx === activeIndex) return;
    setDirection(idx > activeIndex ? 1 : -1);
    setActiveIndex(idx);
  };
  const next = () => go((activeIndex + 1) % total);
  const prev = () => go((activeIndex - 1 + total) % total);

  const rating = lang === 'cs' ? SITE.rating.toFixed(1).replace('.', ',') : SITE.rating.toFixed(1);

  return (
    <div className="relative w-full mt-20 mb-16">
      <div className="text-center mb-6">
        <div className="font-monument text-[9px] tracking-[0.3em] text-accent uppercase">{t.testimonialsTitle}</div>
        <div className="font-editorial text-2xl md:text-3xl text-white mt-2">
          {rating} <span className="text-accent">★★★★★</span>
        </div>
        <div className="font-montreal text-[11px] text-white/50 mt-1">
          {t.testimonialsSub} · {SITE.reviewsCount} {t.reviewsWord}
        </div>
      </div>

      <div className="flex flex-wrap justify-center items-center gap-3 mb-8 max-w-3xl mx-auto">
        {REVIEWS.map((item, idx) => {
          const isActive = idx === activeIndex;
          return (
            <button
              key={item.name}
              onClick={() => go(idx)}
              aria-label={item.name}
              className={`rounded-full flex items-center justify-center font-editorial border-2 transition-all duration-300 ${
                isActive
                  ? 'w-[64px] h-[64px] text-xl border-accent text-accent bg-accent/10 shadow-[0_0_20px_rgba(223,163,120,0.5)]'
                  : 'w-[46px] h-[46px] text-sm border-white/25 text-white/60 hover:border-white/60 hover:text-white'
              }`}
            >
              {initials(item.name)}
            </button>
          );
        })}
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto bg-white/5 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/10 min-h-[260px] flex items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: direction * 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: direction * -20 }}
            transition={{ duration: 0.3 }}
            className="text-center w-full"
          >
            <p className="font-montreal text-white/80 text-sm md:text-base leading-relaxed mb-6">„{active.text[lang]}“</p>
            <div className="font-editorial text-xl text-white">{active.name}</div>
            <div className="font-monument text-[10px] text-accent tracking-wider mt-1">{active.topic[lang]}</div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex flex-col items-center mt-8 z-10 relative">
        <div className="flex gap-6">
          <button onClick={prev} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition flex items-center justify-center text-white text-xl backdrop-blur-sm" aria-label="←">←</button>
          <button onClick={next} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition flex items-center justify-center text-white text-xl backdrop-blur-sm" aria-label="→">→</button>
        </div>
        <a
          href={SITE.googleReviewsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 font-monument text-[9px] tracking-widest text-white/50 hover:text-accent transition-colors"
        >
          {t.allReviews} ↗
        </a>
      </div>
    </div>
  );
}
