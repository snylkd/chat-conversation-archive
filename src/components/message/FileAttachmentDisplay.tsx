import React from 'react';
import { motion } from 'framer-motion';
import { File, X } from 'lucide-react';
import type { FileAttachment } from '../../types/chat';

interface FileAttachmentDisplayProps {
  fileAttachment: FileAttachment;
  onRemove: () => void;
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' bytes';
  else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  else return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

const FileAttachmentDisplay: React.FC<FileAttachmentDisplayProps> = ({ fileAttachment, onRemove }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-2 p-1.5 md:p-2 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-between text-xs md:text-sm"
    >
      <div className="flex items-center gap-1 md:gap-2 truncate">
        <File className="w-3 h-3 md:w-4 md:h-4 text-gray-600 dark:text-gray-300 flex-shrink-0" />
        <span className="truncate">{fileAttachment.name}</span>
        <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:inline">
          ({formatFileSize(fileAttachment.size)})
        </span>
      </div>
      <button 
        type="button"
        onClick={onRemove}
        className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 flex-shrink-0"
      >
        <X className="w-3 h-3 md:w-4 md:h-4 text-gray-600 dark:text-gray-300" />
      </button>
    </motion.div>
  );
};

export default FileAttachmentDisplay;
