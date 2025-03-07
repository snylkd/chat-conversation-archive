const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (message.trim() || fileAttachment) {
    // Création de FormData pour envoyer le message et le fichier
    const formData = new FormData();
    formData.append('message', message.trim());
    
    if (fileAttachment) {
      formData.append('file', fileAttachment); // Assure-toi que 'fileAttachment' est un objet 'File'
    }

    try {
      const response = await fetch('https://api.example.com/sendMessage', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        // Log de la réponse de l'API
        const data = await response.json();
        console.log('Réponse de l\'API:', data);  // Log de la réponse reçue

        // Vérification si la réponse contient un champ "reply"
        onSendMessage(data.reply || 'Réponse vide de l\'API', fileAttachment || undefined);
      } else {
        const errorData = await response.json();
        console.error('Erreur lors de l\'appel à l\'API:', errorData);
      }
    } catch (error) {
      console.error('Erreur de réseau ou autre', error);
    }

    // Réinitialisation de l'état après l'envoi
    setMessage('');
    setFileAttachment(null);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
    }, 1000);
  }
};
