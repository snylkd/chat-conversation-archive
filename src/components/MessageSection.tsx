
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Download } from 'lucide-react';
import type { Conversation } from './ChatContainer';

interface MessageSectionProps {
  conversation: Conversation;
  onSendMessage: (content: string) => void;
}

const MessageSection = ({ conversation, onSendMessage }: MessageSectionProps) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation.messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
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

  const exportConversation = () => {
    const messagesText = conversation.messages.map(msg => 
      `${msg.type === 'user' ? 'Vous' : 'Assistant'} (${new Date(msg.timestamp).toLocaleString()}): ${msg.content}`
    ).join('\n\n');
    
    const element = document.createElement('a');
    const file = new Blob([messagesText], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${conversation.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{conversation.title}</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={exportConversation}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
          title="Exporter la conversation"
        >
          <Download className="w-5 h-5" />
        </motion.button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
                className={`max-w-[70%] rounded-lg px-4 py-2 ${
                  msg.type === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                } shadow-sm`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
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
                    className="h-2 w-2 bg-gray-400 dark:bg-gray-500 rounded-full"
                  />
                  <motion.span
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                    className="h-2 w-2 bg-gray-400 dark:bg-gray-500 rounded-full"
                  />
                  <motion.span
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                    className="h-2 w-2 bg-gray-400 dark:bg-gray-500 rounded-full"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <div className="flex items-end gap-2">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder="Écrivez votre message..."
            className="flex-1 resize-none rounded-lg border border-gray-300 dark:border-gray-600 p-3 focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[2.5rem] max-h-32 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-200"
            rows={1}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={!message.trim()}
            className="p-3 rounded-lg bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default MessageSection;
