import { motion } from 'framer-motion';
import type { Service } from '../data/services';
import type { Lang } from '../data/site';
import { MASTERS } from '../data/site';
import type { Translations } from '../lib/i18n';

interface ServiceDetailProps {
  service: Service;
  onBack: () => void;
  lang: Lang;
  t: Translations;
}

export default function ServiceDetail({ service, onBack, lang, t }: ServiceDetailProps) {
  const master = MASTERS[service.master];
  const priceText = `${service.priceFrom ? `${t.from} ` : ''}${service.price}`;

  return (
    <motion.div
      key="detail"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="absolute inset-0 pointer-events-auto overflow-y-auto"
      style={{ touchAction: 'pan-y' }}
    >
      <button
        onClick={onBack}
        className="fixed top-16 md:top-20 left-4 md:left-8 font-monument text-[10px] md:text-xs tracking-widest hover:text-accent transition-colors z-50 flex items-center gap-3 group bg-black/60 px-3 py-2 rounded-full backdrop-blur-sm pointer-events-auto"
      >
        <span className="w-4 h-[1px] bg-white group-hover:bg-accent transition-colors" />
        {t.back}
      </button>

      <div className="min-h-full px-4 md:px-16 pt-28 pb-16 flex flex-col gap-8 max-w-5xl mx-auto">
        {/* HEADER */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}>
          <div className="font-monument text-[10px] md:text-xs tracking-[0.25em] text-accent mb-3">{service.subtitle[lang]}</div>
          <h1 className="text-3xl md:text-6xl font-editorial mb-4 leading-[1.05]">{service.title[lang]}</h1>
          <div className="flex flex-wrap items-center gap-4 md:gap-8 border-t border-white/10 pt-5">
            {service.time && (
              <div>
                <div className="font-monument text-[8px] text-[#a3a3a3] mb-1 tracking-widest">{t.duration}</div>
                <div className="font-editorial text-lg md:text-2xl">{service.time}</div>
              </div>
            )}
            <div>
              <div className="font-monument text-[8px] text-[#a3a3a3] mb-1 tracking-widest">{t.price}</div>
              <div className="font-editorial text-lg md:text-2xl text-accent">{priceText}</div>
            </div>
            <a
              href={`tel:${master.tel}`}
              className="w-full md:w-auto mt-2 md:mt-0 md:ml-auto px-8 py-3 bg-accent text-black text-center font-monument text-[10px] tracking-widest rounded-full hover:bg-white transition-colors"
            >
              {t.callTo} · {master.phone}
            </a>
          </div>
        </motion.div>

        {/* DESCRIPTION */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.25 }} className="glass-panel rounded-3xl p-6 md:p-10">
          <p className="font-montreal text-base md:text-lg text-white/80 leading-relaxed">{service.desc[lang]}</p>
        </motion.div>

        {/* PRICE LIST */}
        {service.priceGroups && service.priceGroups.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.35 }} className="glass-panel rounded-3xl p-6 md:p-10">
            <div className="font-monument text-[10px] tracking-[0.25em] text-accent mb-5">{t.priceListTitle}</div>
            <div className="flex flex-col gap-6">
              {service.priceGroups.map((group, gi) => (
                <div key={gi}>
                  {group.title && <div className="font-editorial italic text-lg text-white/90 mb-3">{group.title[lang]}</div>}
                  <div className="flex flex-col">
                    {group.rows.map((row, ri) => (
                      <div key={ri} className="flex items-baseline justify-between gap-4 py-2.5 border-b border-white/10 last:border-b-0">
                        <span className="font-montreal text-sm md:text-base text-white/75">{row.label[lang]}</span>
                        <span className="font-editorial text-base md:text-lg text-accent whitespace-nowrap">{row.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* INCLUDES */}
        {service.includes && service.includes[lang].length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="glass-panel rounded-3xl p-6 md:p-10">
            <div className="font-monument text-[10px] tracking-[0.25em] text-accent mb-5">{t.includesTitle}</div>
            <div className="flex flex-col gap-4">
              {service.includes[lang].map((step, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-editorial text-sm bg-accent/15 text-accent">{i + 1}</div>
                  <span className="font-montreal text-sm text-white/70 pt-1.5">{step}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* EXTRAS */}
        {service.extras && service.extras[lang].length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }} className="glass-panel rounded-3xl p-6 md:p-10">
            <div className="font-monument text-[10px] tracking-[0.25em] text-accent mb-5">{t.extrasTitle}</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {service.extras[lang].map((b, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-accent mt-0.5 shrink-0">✦</span>
                  <span className="font-montreal text-sm text-white/70">{b}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }} className="text-center py-6">
          <p className="font-montreal text-sm text-white/50 mb-1">{t.ctaQuestion}</p>
          <p className="font-montreal text-xs text-white/40 mb-5">
            {t.ordersWith}: {master.name} · {master.role[lang]}
            {master.note ? ` (${master.note[lang]})` : ''}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href={`tel:${master.tel}`} className="px-10 py-4 bg-accent text-black font-monument text-[11px] tracking-widest rounded-full hover:bg-white transition-colors">
              {t.callTo} · {master.phone}
            </a>
            {service.bookingUrl && (
              <a href={service.bookingUrl} target="_blank" rel="noopener noreferrer" className="px-10 py-4 border border-accent/60 text-accent font-monument text-[11px] tracking-widest rounded-full hover:bg-accent hover:text-black transition-colors">
                {t.bookOnline} ↗
              </a>
            )}
          </div>
          <p className="font-montreal text-[11px] text-white/35 mt-6">{t.cashOnly}</p>
        </motion.div>
      </div>
    </motion.div>
  );
}
