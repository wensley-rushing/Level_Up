import { motion } from 'framer-motion';

const Loading = () => {
  return (
    <motion.div
      className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="loading-spinner"></div>
      <motion.p
        className="text-white text-2xl mt-4"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      >
        Loading Mind-Blowing Data...
      </motion.p>
    </motion.div>
  );
};

export default Loading;