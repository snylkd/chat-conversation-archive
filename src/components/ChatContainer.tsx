
import React, { useState, useEffect } from 'react';
import MessageSection from './MessageSection';
import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from "@/hooks/use-toast";

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
  const isMobile = useIsMobile();

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
        
        // Set the active conversation to the most recent one if available
        if (parsedConversations.length > 0) {
          setActiveConversation(parsedConversations[0].id);
        } else {
          // If no conversations are found, create a new one automatically
          createNewConversation();
        }
      } catch (e) {
        console.error("Failed to parse saved conversations:", e);
        // If there's an error parsing, create a new conversation
        createNewConversation();
      }
    } else {
      // If no conversations in localStorage, create a new one automatically
      createNewConversation();
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
    if (!content) return "Conversation avec l'assistant";
    
    // Take the first 30 characters or the first sentence, whichever is shorter
    const firstSentence = content.split(/[.!?]/)[0].trim();
    const shortTitle = content.length > 30 ? content.substring(0, 30) + "..." : content;
    
    return firstSentence.length < shortTitle.length ? firstSentence : shortTitle;
  };

  const createNewConversation = () => {
    const newConversation: Conversation = {
      id: Math.random().toString(36).substring(7),
      title: "Conversation avec l'assistant",
      messages: [
        {
          id: Math.random().toString(36).substring(7),
          content: "Bonjour ! Comment puis-je vous aider aujourd'hui ?",
          type: 'assistant',
          timestamp: new Date(),
        }
      ],
      lastMessage: "Bonjour ! Comment puis-je vous aider aujourd'hui ?",
      timestamp: new Date(),
    };
    setConversations(prevConversations => [newConversation, ...prevConversations]);
    setActiveConversation(newConversation.id);
  };

  const deleteConversation = (id: string) => {
    setConversations(conversations.filter(conv => conv.id !== id));
    if (activeConversation === id) {
      setActiveConversation(null);
      // If we just deleted the active conversation, create a new one if there are no more
      if (conversations.length <= 1) {
        createNewConversation();
      } else {
        // Set the next available conversation as active
        const nextConv = conversations.find(conv => conv.id !== id);
        if (nextConv) {
          setActiveConversation(nextConv.id);
        }
      }
    }
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

        let updatedTitle = conv.title;
        if (type === 'user' && conv.messages.length === 1 && content) {
          updatedTitle = extractTitleFromMessage(content);
        }

        const updatedMessages = [...conv.messages, newMessage];
        
        if (type === 'user') {
          setTimeout(() => {
            const responseContent = attachment
              ? `J'ai bien reçu votre fichier: "${attachment.name}"`
              : `Réponse automatique à: "${content}"`;
            
            addMessage(conversationId, responseContent, 'assistant');
          }, 1000); // Attendre 1 seconde avant la réponse de l'IA
        }

        return {
          ...conv,
          title: updatedTitle,
          messages: updatedMessages,
          lastMessage: content || (attachment ? `Fichier: ${attachment.name}` : ""),
          timestamp: new Date(),
        };
      }
      return conv;
    }));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex h-screen bg-gray-50 dark:bg-gray-900 p-2 md:p-4 transition-colors duration-200 overflow-hidden"
    >
      <div className="flex w-full max-w-7xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden relative">
        {/* Dark mode toggle */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
          aria-label="Toggle theme"
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </motion.button>
        
        {/* Main chat content taking full width */}
        <div className="flex-1 flex flex-col">
          {activeConversation ? (
            <div className="flex-1 flex">
              <MessageSection
                conversation={conversations.find(c => c.id === activeConversation)!}
                onSendMessage={(content, attachment) => addMessage(activeConversation, content, 'user', attachment)}
              />
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-200 px-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
              >
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Création d'une nouvelle conversation...
                </p>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ChatContainer;
