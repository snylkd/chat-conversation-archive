const addMessage = async (conversationId: string, content: string, type: 'user' | 'assistant', attachment?: FileAttachment) => {
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
      if (type === 'user' && conv.messages.length === 0 && content) {
        updatedTitle = extractTitleFromMessage(content);
      }

      const updatedMessages = [...conv.messages, newMessage];
      
      if (type === 'user') {
        // Envoi de la requête à l'API
        setTimeout(async () => {
          const responseContent = attachment
            ? `J'ai bien reçu votre fichier: "${attachment.name}"`
            : `Réponse automatique à: "${content}"`;

          // Ajouter la réponse de l'API
          try {
            const formData = new FormData();
            formData.append('message', content);

            if (attachment) {
              formData.append('file', attachment);
            }

            const response = await fetch('https://api.example.com/sendMessage', {
              method: 'POST',
              body: formData,
            });

            if (response.ok) {
              const data = await response.json();

              // Ajouter la réponse de l'API à la conversation
              addMessage(conversationId, data.reply || 'Réponse vide de l\'API', 'assistant');
            } else {
              console.error('Erreur lors de l\'appel à l\'API');
            }
          } catch (error) {
            console.error('Erreur lors de l\'appel réseau', error);
          }
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
