
import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';

interface EmptyStateProps {
  onCreate: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onCreate }) => {
  // Appelle la fonction onCreate automatiquement au chargement du composant
  React.useEffect(() => {
    onCreate();
  }, [onCreate]);

  return (
    <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-200 px-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center text-gray-500 dark:text-gray-400"
      >
        <MessageSquare className="w-12 h-12 md:w-16 md:h-16 mb-4 animate-pulse" />
        <span className="text-base md:text-lg font-medium text-center">Initialisation du chat...</span>
      </motion.div>
    </div>
  );
};

export default EmptyState;
