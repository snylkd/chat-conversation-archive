
import React from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';

interface MessageHeaderProps {
  title: string;
  onExport: () => void;
}

const MessageHeader: React.FC<MessageHeaderProps> = ({ title, onExport }) => {
  return (
    <div className="px-3 py-2 md:p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex justify-between items-center">
      <h2 className="text-sm md:text-lg font-semibold text-gray-900 dark:text-gray-100 pl-10 md:pl-0 truncate">
        {title}
      </h2>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onExport}
        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
        title="Exporter la conversation"
      >
        <Download className="w-4 h-4 md:w-5 md:h-5" />
      </motion.button>
    </div>
  );
};

export default MessageHeader;
