const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Vérifie que le message n'est pas vide avant de soumettre
  if (message.trim() === '') {
    console.error('Le message ne peut pas être vide');
    return;
  }

  if (message.trim() || fileAttachment) {
    // FormData pour envoyer un message et un fichier
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
        const data = await response.json();
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
