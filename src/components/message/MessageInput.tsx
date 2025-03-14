
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, Paperclip } from 'lucide-react';
import type { FileAttachment } from '../ChatContainer';

interface MessageInputProps {
  message: string;
  onMessageChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onSubmit: (e: React.FormEvent) => void;
  onFileClick: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileAttachment: FileAttachment | null;
}

const MessageInput: React.FC<MessageInputProps> = ({
  message,
  onMessageChange,
  onKeyDown,
  onSubmit,
  onFileClick,
  fileInputRef,
  onFileChange,
  fileAttachment
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <form onSubmit={onSubmit} className="p-2 md:p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div className="flex items-end gap-1 md:gap-2">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={onMessageChange}
          onKeyDown={onKeyDown}
          placeholder="Écrivez votre message..."
          className="flex-1 resize-none rounded-lg border border-gray-300 dark:border-gray-600 p-2 md:p-3 focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[2.5rem] max-h-32 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-200 text-sm md:text-base"
          rows={1}
        />
        
        <input 
          type="file"
          ref={fileInputRef}
          onChange={onFileChange}
          className="hidden"
          accept=".docx"
        />
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={onFileClick}
          className="p-2 md:p-3 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
          title="Joindre un fichier DOCX"
        >
          <Paperclip className="w-4 h-4 md:w-5 md:h-5" />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={!message.trim() && !fileAttachment}
          className="p-2 md:p-3 rounded-lg bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <Send className="w-4 h-4 md:w-5 md:h-5" />
        </motion.button>
      </div>
    </form>
  );
};

export default MessageInput;
