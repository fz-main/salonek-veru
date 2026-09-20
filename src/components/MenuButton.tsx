import { motion } from 'framer-motion';

interface MenuButtonProps {
  title: string;
  subtitle: string;
  onClick: () => void;
  enterLabel: string;
}

export default function MenuButton({ title, subtitle, onClick, enterLabel }: MenuButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className="group relative flex flex-col items-center pointer-events-auto px-1 pb-4"
      whileHover="hover"
      style={{ flex: '1 1 auto', minWidth: '110px', maxWidth: '200px' }}
    >
      <motion.div
        variants={{ hover: { scale: 1.05, color: '#DFA378', transition: { duration: 0.3 } } }}
        className="font-editorial text-sm sm:text-base md:text-lg lg:text-xl italic text-center text-white drop-shadow-2xl leading-tight"
      >
        {title}
      </motion.div>
      <motion.div
        variants={{ hover: { opacity: 1, y: 0, transition: { delay: 0.1 } } }}
        initial={{ opacity: 0.9, y: 0 }}
        className="font-montreal text-[9px] md:text-[10px] text-white/70 text-center mt-1 max-w-[170px] leading-tight"
      >
        {subtitle}
      </motion.div>
      <motion.div
        variants={{ hover: { opacity: 1, y: 0, transition: { delay: 0.15 } } }}
        initial={{ opacity: 0, y: 6 }}
        className="absolute top-full left-1/2 -translate-x-1/2 -mt-3 font-monument text-[6px] md:text-[7px] tracking-[0.2em] whitespace-nowrap text-accent"
      >
        {enterLabel}
      </motion.div>
    </motion.button>
  );
}
