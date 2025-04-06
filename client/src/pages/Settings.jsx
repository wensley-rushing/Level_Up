import { useContext } from 'react';
import { motion } from 'framer-motion';
import { ThemeContext } from '../ThemeContext';

const Settings = () => {
  const { theme } = useContext(ThemeContext);
  
  return (
    <motion.div
      className={`p-6 ml-80 ${theme === 'dark' ? 'bg-blue-900/20 text-white' : 'bg-white text-black'}`}
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, type: 'spring', stiffness: 80 }}
    >
      <h2 className="text-2xl font-bold mb-4">Settings</h2>
      <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}>Coming soon...</p>
    </motion.div>
  );
};

export default Settings;