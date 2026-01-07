import { motion } from 'framer-motion';

const EMOJIS = ['🎁', '🎂', '🎈', '🎉', '✨', '🌟', '💝', '🎊'];

export const FloatingEmoji = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {EMOJIS.map((emoji, i) => (
        <motion.div
          key={i}
          className="absolute text-3xl opacity-20"
          initial={{
            x: `${10 + Math.random() * 80}%`,
            y: `${10 + Math.random() * 80}%`,
          }}
          animate={{
            y: [`${10 + Math.random() * 80}%`, `${5 + Math.random() * 85}%`],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
            delay: i * 0.3,
          }}
        >
          {emoji}
        </motion.div>
      ))}
    </div>
  );
};
