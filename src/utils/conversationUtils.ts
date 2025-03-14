
import { Conversation, Message, FileAttachment } from '../types/chat';

// Helper function to extract a title from user message
export const extractTitleFromMessage = (content: string): string => {
  if (!content) return "Conversation avec l'assistant";
  
  // Take the first 30 characters or the first sentence, whichever is shorter
  const firstSentence = content.split(/[.!?]/)[0].trim();
  const shortTitle = content.length > 30 ? content.substring(0, 30) + "..." : content;
  
  return firstSentence.length < shortTitle.length ? firstSentence : shortTitle;
};

export const createNewConversation = (): Conversation => {
  return {
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
};

export const addMessageToConversation = (
  conversation: Conversation,
  content: string,
  type: 'user' | 'assistant',
  attachment?: FileAttachment
): Conversation => {
  const newMessage: Message = {
    id: Math.random().toString(36).substring(7),
    content,
    type,
    timestamp: new Date(),
    attachment
  };

  let updatedTitle = conversation.title;
  if (type === 'user' && conversation.messages.length === 1 && content) {
    updatedTitle = extractTitleFromMessage(content);
  }

  return {
    ...conversation,
    title: updatedTitle,
    messages: [...conversation.messages, newMessage],
    lastMessage: content || (attachment ? `Fichier: ${attachment.name}` : ""),
    timestamp: new Date(),
  };
};
