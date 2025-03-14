
import React from 'react';
import { motion } from 'framer-motion';
import { File } from 'lucide-react';
import type { Message as MessageType } from '../../types/chat';

interface MessageProps {
  message: MessageType;
  isMobile: boolean;
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' bytes';
  else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  else return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

const Message: React.FC<MessageProps> = ({ message, isMobile }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[85%] md:max-w-[70%] rounded-lg px-3 py-2 md:px-4 md:py-2 ${
          message.type === 'user'
            ? 'bg-primary text-primary-foreground'
            : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100'
        } shadow-sm`}
      >
        {message.content && <p className="whitespace-pre-wrap text-sm md:text-base">{message.content}</p>}
        
        {message.attachment && (
          <div className="mt-2 p-2 bg-black/10 dark:bg-white/10 rounded-md flex items-center gap-2">
            <File className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="truncate text-xs md:text-sm font-medium">{message.attachment.name}</p>
              <p className="text-xs opacity-70">{formatFileSize(message.attachment.size)}</p>
            </div>
            {message.attachment.url && (
              <a 
                href={message.attachment.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs underline text-primary-foreground/70 hover:text-primary-foreground flex-shrink-0"
                download={message.attachment.name}
              >
                {isMobile ? 'DL' : 'Télécharger'}
              </a>
            )}
          </div>
        )}
        
        <div className={`text-xs mt-1 ${
          message.type === 'user' ? 'text-primary-foreground/70' : 'text-gray-400 dark:text-gray-500'
        }`}>
          {new Date(message.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </motion.div>
  );
};

export default Message;
