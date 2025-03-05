
import React, { useState, useEffect } from 'react';
import ConversationsList from './ConversationsList';
import MessageSection from './MessageSection';
import { PlusCircle, Moon, Sun, Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

export interface FileAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
}

export interface Message {
  id: string;
  content: string;
  type: 'user' | 'assistant';
  timestamp: Date;
  attachment?: FileAttachment;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  lastMessage: string;
  timestamp: Date;
}

const ChatContainer = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const isMobile = useIsMobile();

  // Automatically close sidebar on mobile when conversation selected
  useEffect(() => {
    if (isMobile && activeConversation) {
      setSidebarOpen(false);
    }
  }, [activeConversation, isMobile]);

  // Close sidebar by default on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile]);

  // Load conversations from localStorage on component mount
  useEffect(() => {
    const savedConversations = localStorage.getItem('chatConversations');
    if (savedConversations) {
      try {
        const parsedConversations = JSON.parse(savedConversations);
        // Convert string dates back to Date objects
        parsedConversations.forEach((conv: any) => {
          conv.timestamp = new Date(conv.timestamp);
          conv.messages.forEach((msg: any) => {
            msg.timestamp = new Date(msg.timestamp);
          });
        });
        setConversations(parsedConversations);
      } catch (e) {
        console.error("Failed to parse saved conversations:", e);
      }
    }
  }, []);

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('chatConversations', JSON.stringify(conversations));
  }, [conversations]);

  // Toggle dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Helper function to extract a title from user message
  const extractTitleFromMessage = (content: string): string => {
    if (!content) return "Nouvelle conversation";
    
    // Take the first 30 characters or the first sentence, whichever is shorter
    const firstSentence = content.split(/[.!?]/)[0].trim();
    const shortTitle = content.length > 30 ? content.substring(0, 30) + "..." : content;
    
    return firstSentence.length < shortTitle.length ? firstSentence : shortTitle;
  };

  const createNewConversation = () => {
    const newConversation: Conversation = {
      id: Math.random().toString(36).substring(7),
      title: `Conversation ${conversations.length + 1}`,
      messages: [],
      lastMessage: "Nouvelle conversation",
      timestamp: new Date(),
    };
    setConversations([newConversation, ...conversations]);
    setActiveConversation(newConversation.id);
    // Toast notification removed
  };

  const deleteConversation = (id: string) => {
    setConversations(conversations.filter(conv => conv.id !== id));
    if (activeConversation === id) {
      setActiveConversation(null);
    }
    // Toast notification removed
  };

  const updateConversationTitle = (id: string, newTitle: string) => {
    setConversations(conversations.map(conv => {
      if (conv.id === id) {
        return {
          ...conv,
          title: newTitle
        };
      }
      return conv;
    }));
    // Toast notification removed
  };

  const addMessage = (conversationId: string, content: string, type: 'user' | 'assistant', attachment?: FileAttachment) => {
    setConversations(conversations.map(conv => {
      if (conv.id === conversationId) {
        const newMessage: Message = {
          id: Math.random().toString(36).substring(7),
          content,
          type,
          timestamp: new Date(),
          attachment
        };
        
        // Generate title from first user message if it's the first message
        let updatedTitle = conv.title;
        if (type === 'user' && conv.messages.length === 0 && content) {
          updatedTitle = extractTitleFromMessage(content);
        }
        
        // Simulate AI response
        if (type === 'user') {
          setTimeout(() => {
            const responseContent = attachment 
              ? `J'ai bien reçu votre fichier: "${attachment.name}"`
              : `Réponse automatique à: "${content}"`;
            
            addMessage(
              conversationId, 
              responseContent, 
              'assistant'
            );
          }, 1000);
        }
        
        return {
          ...conv,
          title: updatedTitle,
          messages: [...conv.messages, newMessage],
          lastMessage: content || (attachment ? `Fichier: ${attachment.name}` : ""),
          timestamp: new Date(),
        };
      }
      return conv;
    }));
  };

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex h-screen bg-gray-50 dark:bg-gray-900 p-2 md:p-4 transition-colors duration-200 overflow-hidden"
    >
      <div className="flex w-full max-w-7xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden relative">
        {/* Mobile menu button */}
        <button 
          onClick={toggleSidebar}
          className="absolute top-4 left-4 z-20 p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 md:hidden"
          aria-label="Toggle conversations"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Sidebar with conditional classes for mobile */}
        <div 
          className={`${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } absolute md:relative inset-y-0 left-0 z-10 md:translate-x-0 transition-transform duration-300 ease-in-out w-full max-w-[85vw] md:max-w-[280px] md:w-80`}
        >
          <ConversationsList
            conversations={conversations}
            activeConversation={activeConversation}
            onSelect={setActiveConversation}
            onDelete={deleteConversation}
            onCreate={createNewConversation}
            onUpdateTitle={updateConversationTitle}
          />
        </div>

        {/* Main content with adjusted padding for mobile menu */}
        <div className="flex-1 flex flex-col relative">
          {/* Dark mode toggle with repositioning for mobile */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </motion.button>
          
          {activeConversation ? (
            <div className={`flex-1 flex ${!sidebarOpen ? 'md:pl-0' : 'md:pl-0'}`}>
              <MessageSection
                conversation={conversations.find(c => c.id === activeConversation)!}
                onSendMessage={(content, attachment) => addMessage(activeConversation, content, 'user', attachment)}
              />
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-200 px-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={createNewConversation}
                className="flex flex-col items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              >
                <PlusCircle className="w-12 h-12 md:w-16 md:h-16 mb-4" />
                <span className="text-base md:text-lg font-medium text-center">Démarrer une nouvelle conversation</span>
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ChatContainer;
