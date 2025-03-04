
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Download, Paperclip, X, File } from 'lucide-react';
import type { Conversation, FileAttachment } from './ChatContainer';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

interface MessageSectionProps {
  conversation: Conversation;
  onSendMessage: (content: string, attachment?: FileAttachment) => void;
}

const MessageSection = ({ conversation, onSendMessage }: MessageSectionProps) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [fileAttachment, setFileAttachment] = useState<FileAttachment | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation.messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() || fileAttachment) {
      onSendMessage(message.trim(), fileAttachment || undefined);
      setMessage('');
      setFileAttachment(null);
      setIsTyping(true);
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
      
      // Simulate typing indicator for 1 second
      setTimeout(() => {
        setIsTyping(false);
      }, 1000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    // Auto-resize textarea
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "Fichier trop volumineux",
          description: "Le fichier ne doit pas dépasser 5MB.",
          variant: "destructive",
        });
        return;
      }

      const fileUrl = URL.createObjectURL(file);
      const newFileAttachment: FileAttachment = {
        id: Math.random().toString(36).substring(7),
        name: file.name,
        type: file.type,
        size: file.size,
        url: fileUrl
      };
      
      setFileAttachment(newFileAttachment);
      toast({
        title: "Fichier prêt à envoyer",
        description: `${file.name} (${(file.size / 1024).toFixed(1)} KB)`,
      });
    }
  };

  const removeAttachment = () => {
    if (fileAttachment) {
      URL.revokeObjectURL(fileAttachment.url);
      setFileAttachment(null);
    }
  };

  const exportConversation = () => {
    const messagesText = conversation.messages.map(msg => {
      let text = `${msg.type === 'user' ? 'Vous' : 'Assistant'} (${new Date(msg.timestamp).toLocaleString()}): ${msg.content}`;
      if (msg.attachment) {
        text += `\n[Fichier joint: ${msg.attachment.name} - ${(msg.attachment.size / 1024).toFixed(1)} KB]`;
      }
      return text;
    }).join('\n\n');
    
    const element = document.createElement('a');
    const file = new Blob([messagesText], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${conversation.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="px-3 py-2 md:p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex justify-between items-center">
        <h2 className="text-sm md:text-lg font-semibold text-gray-900 dark:text-gray-100 pl-10 md:pl-0 truncate">
          {conversation.title}
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={exportConversation}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
          title="Exporter la conversation"
        >
          <Download className="w-4 h-4 md:w-5 md:h-5" />
        </motion.button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4">
        <AnimatePresence>
          {conversation.messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] md:max-w-[70%] rounded-lg px-3 py-2 md:px-4 md:py-2 ${
                  msg.type === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                } shadow-sm`}
              >
                {msg.content && <p className="whitespace-pre-wrap text-sm md:text-base">{msg.content}</p>}
                
                {msg.attachment && (
                  <div className="mt-2 p-2 bg-black/10 dark:bg-white/10 rounded-md flex items-center gap-2">
                    <File className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-xs md:text-sm font-medium">{msg.attachment.name}</p>
                      <p className="text-xs opacity-70">{formatFileSize(msg.attachment.size)}</p>
                    </div>
                    {msg.attachment.url && (
                      <a 
                        href={msg.attachment.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs underline text-primary-foreground/70 hover:text-primary-foreground flex-shrink-0"
                        download={msg.attachment.name}
                      >
                        {isMobile ? 'DL' : 'Télécharger'}
                      </a>
                    )}
                  </div>
                )}
                
                <div className={`text-xs mt-1 ${
                  msg.type === 'user' ? 'text-primary-foreground/70' : 'text-gray-400 dark:text-gray-500'
                }`}>
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </motion.div>
          ))}
          
          {isTyping && (
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
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-2 md:p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 transition-colors duration-200">
        {fileAttachment && (
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
              onClick={removeAttachment}
              className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 flex-shrink-0"
            >
              <X className="w-3 h-3 md:w-4 md:h-4 text-gray-600 dark:text-gray-300" />
            </button>
          </motion.div>
        )}

        <div className="flex items-end gap-1 md:gap-2">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder="Écrivez votre message..."
            className="flex-1 resize-none rounded-lg border border-gray-300 dark:border-gray-600 p-2 md:p-3 focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[2.5rem] max-h-32 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-200 text-sm md:text-base"
            rows={1}
          />
          
          <input 
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*,.pdf,.doc,.docx,.txt,.csv,.xlsx"
          />
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={handleFileClick}
            className="p-2 md:p-3 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Joindre un fichier"
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
    </div>
  );
};

export default MessageSection;
