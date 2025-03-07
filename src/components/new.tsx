const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (message.trim() || fileAttachment) {
    // Log des données envoyées pour déboguer
    console.log('Message:', message.trim());
    console.log('Fichier joint:', fileAttachment);

    try {
      const formData = new FormData();
      formData.append('message', message.trim());
      if (fileAttachment) {
        formData.append('file', fileAttachment);
      }

      const response = await fetch('https://api.example.com/sendMessage', {
        method: 'POST',
        body: formData, // Ici, on envoie un FormData au lieu d'un JSON
      });

      if (response.ok) {
        const data = await response.json();
        onSendMessage(data.reply || 'Réponse vide de l\'API', fileAttachment || undefined);
      } else {
        const errorData = await response.json();
        console.error('Erreur lors de l\'appel à l\'API:', errorData);
      }
    } catch (error) {
      console.error('Erreur de réseau ou autre', error);
    }

    // Clear input après envoi
    setMessage('');
    setFileAttachment(null);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
    }, 1000);
  }
};
