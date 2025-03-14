
import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import type { Conversation, FileAttachment } from '../types/chat';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { ScrollArea } from "@/components/ui/scroll-area";

// Import the new components
import Message from './message/Message';
import TypingIndicator from './message/TypingIndicator';
import FileAttachmentDisplay from './message/FileAttachmentDisplay';
import MessageInput from './message/MessageInput';
import MessageHeader from './message/MessageHeader';

interface MessageSectionProps {
  conversation: Conversation;
  onSendMessage: (content: string, attachment?: FileAttachment) => void;
}

const MessageSection = ({ conversation, onSendMessage }: MessageSectionProps) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [fileAttachment, setFileAttachment] = useState<FileAttachment | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
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
      
      // Clear the message input field immediately after sending
      setMessage('');
      setFileAttachment(null);
      setIsTyping(true);
      
      // Simuler un indicateur de "tape..." pendant 1 seconde
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
      // Check if file is a .docx file
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      
      if (fileExtension !== 'docx') {
        toast({
          title: "Type de fichier non supporté",
          description: "Seuls les fichiers .docx sont acceptés",
          variant: "destructive",
        });
        // Reset the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "Fichier trop volumineux",
          description: "La taille maximale autorisée est de 5 Mo",
          variant: "destructive",
        });
        // Reset the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
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
        title: "Fichier ajouté",
        description: `${file.name} a été ajouté à votre message`,
      });
    }
  };

  const removeAttachment = () => {
    if (fileAttachment) {
      URL.revokeObjectURL(fileAttachment.url);
      setFileAttachment(null);
      toast({
        title: "Fichier supprimé",
        description: "Le fichier a été retiré de votre message",
      });
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

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <MessageHeader 
        title={conversation.title} 
        onExport={exportConversation} 
      />

      <ScrollArea className="flex-1 p-3 md:p-4">
        <div className="space-y-3 md:space-y-4">
          <AnimatePresence>
            {conversation.messages.map((msg) => (
              <Message key={msg.id} message={msg} isMobile={isMobile} />
            ))}
            
            {isTyping && <TypingIndicator />}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {fileAttachment && (
        <FileAttachmentDisplay 
          fileAttachment={fileAttachment} 
          onRemove={removeAttachment} 
        />
      )}

      <MessageInput 
        message={message}
        onMessageChange={handleTextareaChange}
        onKeyDown={handleKeyDown}
        onSubmit={handleSubmit}
        onFileClick={handleFileClick}
        fileInputRef={fileInputRef}
        onFileChange={handleFileChange}
        fileAttachment={fileAttachment}
      />
    </div>
  );
};

export default MessageSection;
