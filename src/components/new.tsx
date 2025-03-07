const handleSubmit = async (e) => {
  e.preventDefault();

  // Créez un objet FormData pour envoyer les données
  const formData = new FormData();
  formData.append('message', message);
  if (fileAttachment) {
    formData.append('attachment', fileAttachment);
  }

  try {
    // Remplacez 'YOUR_API_URL' par l'URL de votre API
    const response = await fetch('YOUR_API_URL', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Erreur lors de l\'envoi du message');
    }

    const data = await response.json();

    // Traitez la réponse de l'API ici
    // Par exemple, ajoutez la réponse du bot à la conversation
    setConversation((prevConversation) => ({
      ...prevConversation,
      messages: [
        ...prevConversation.messages,
        { id: Date.now(), type: 'bot', content: data.reply },
      ],
    }));

    // Réinitialisez le champ de message et le fichier joint
    setMessage('');
    setFileAttachment(null);
  } catch (error) {
    console.error('Erreur:', error);
    // Gérez les erreurs ici, par exemple en affichant un message d'erreur à l'utilisateur
  }
};
