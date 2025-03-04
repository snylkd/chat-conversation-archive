
import React, { useState, useEffect } from 'react';
import ConversationsList from './ConversationsList';
import MessageSection from './MessageSection';
import { PlusCircle, Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

export interface Message {
  id: string;
  content: string;
  type: 'user' | 'assistant';
  timestamp: Date;
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
  const { toast } = useToast();

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
    toast({
      title: "Nouvelle conversation créée",
      description: "Commencez à discuter maintenant!",
    });
  };

  const deleteConversation = (id: string) => {
    setConversations(conversations.filter(conv => conv.id !== id));
    if (activeConversation === id) {
      setActiveConversation(null);
    }
    toast({
      title: "Conversation supprimée",
      description: "La conversation a été supprimée avec succès.",
      variant: "destructive",
    });
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
    toast({
      title: "Titre mis à jour",
      description: "Le titre de la conversation a été modifié.",
    });
  };

  const addMessage = (conversationId: string, content: string, type: 'user' | 'assistant') => {
    setConversations(conversations.map(conv => {
      if (conv.id === conversationId) {
        const newMessage: Message = {
          id: Math.random().toString(36).substring(7),
          content,
          type,
          timestamp: new Date(),
        };
        
        // Simulate AI response
        if (type === 'user') {
          setTimeout(() => {
            addMessage(
              conversationId, 
              `Réponse automatique à: "${content}"`, 
              'assistant'
            );
          }, 1000);
        }
        
        return {
          ...conv,
          messages: [...conv.messages, newMessage],
          lastMessage: content,
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
      className="flex h-screen bg-gray-50 dark:bg-gray-900 p-4 transition-colors duration-200"
    >
      <div className="flex w-full max-w-7xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <ConversationsList
          conversations={conversations}
          activeConversation={activeConversation}
          onSelect={setActiveConversation}
          onDelete={deleteConversation}
          onCreate={createNewConversation}
          onUpdateTitle={updateConversationTitle}
        />
        <div className="flex-1 flex flex-col relative">
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
            <MessageSection
              conversation={conversations.find(c => c.id === activeConversation)!}
              onSendMessage={(content) => addMessage(activeConversation, content, 'user')}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={createNewConversation}
                className="flex flex-col items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              >
                <PlusCircle className="w-16 h-16 mb-4" />
                <span className="text-lg font-medium">Démarrer une nouvelle conversation</span>
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ChatContainer;
