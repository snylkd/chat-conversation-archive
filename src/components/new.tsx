const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (message.trim() || fileAttachment) {
    setIsTyping(true);

    // Création d'un objet FormData pour envoyer le message et le fichier
    const formData = new FormData();
    formData.append("message", message.trim());
    
    // Vérifie si fileAttachment est un fichier avant de l'ajouter
    if (fileAttachment && fileAttachment instanceof File) {
      formData.append("file", fileAttachment);
    }

    try {
      // Envoi de la requête à l'API (exemple d'URL de l'API)
      const response = await fetch('https://ton-api.com/messages', {
        method: 'POST',
        body: formData, // On envoie les données sous forme de FormData
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi du message');
      }

      const data = await response.json();

      // Traitement de la réponse de l'API (exemple: affichage d'un message retourné)
      console.log('Réponse de l\'API:', data);

      // Remise à zéro des champs après la réponse
      setMessage('');
      setFileAttachment(null);

      // Optionnel: Simuler un indicateur de "tape..." pendant 1 seconde
      setTimeout(() => {
        setIsTyping(false);
      }, 1000);
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      // Optionnel: Gérer les erreurs d'API ou d'envoi
      setIsTyping(false);
    }
  }
};
