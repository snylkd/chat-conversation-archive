
import React from 'react';
import { motion } from 'framer-motion';

const TypingIndicator: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex justify-start"
    >
      <div className="max-w-[70%] rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm">
        <div className="flex space-x-1">
          <motion.span
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="h-1.5 w-1.5 md:h-2 md:w-2 bg-gray-400 dark:bg-gray-500 rounded-full"
          />
          <motion.span
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
            className="h-1.5 w-1.5 md:h-2 md:w-2 bg-gray-400 dark:bg-gray-500 rounded-full"
          />
          <motion.span
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
            className="h-1.5 w-1.5 md:h-2 md:w-2 bg-gray-400 dark:bg-gray-500 rounded-full"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default TypingIndicator;
