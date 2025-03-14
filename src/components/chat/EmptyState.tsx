
import React from 'react';
import { motion } from 'framer-motion';
import { PlusCircle } from 'lucide-react';

interface EmptyStateProps {
  onCreate: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onCreate }) => {
  return (
    <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-200 px-6">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onCreate}
        className="flex flex-col items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
      >
        <PlusCircle className="w-12 h-12 md:w-16 md:h-16 mb-4" />
        <span className="text-base md:text-lg font-medium text-center">Démarrer une nouvelle conversation</span>
      </motion.button>
    </div>
  );
};

export default EmptyState;
