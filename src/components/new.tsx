const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Vérifie si le message n'est pas vide
  if (message.trim()) {
    // Crée un objet FormData pour envoyer les données
    const formData = new FormData();
    formData.append('message', message.trim());

    // N'ajoute le fichier que s'il est présent
    if (fileAttachment) {
      formData.append('attachment', fileAttachment);
    }

    try {
      // Envoie la requête POST avec les données
      const response = await fetch('http://localhost:3001/api/message', {
        method: 'POST',
        body: formData,
      });

      // Vérifie si la réponse est correcte
      if (response.ok) {
        // Réinitialise le champ message et le fichier joint après l'envoi
        setMessage('');
        setFileAttachment(null);
        // Gère la réponse du serveur si nécessaire
        const data = await response.json();
        console.log('Message envoyé avec succès:', data);
      } else {
        // Gère les erreurs de réponse
        console.error('Erreur lors de l\'envoi du message:', response.statusText);
      }
    } catch (error) {
      // Gère les erreurs de réseau ou autres
      console.error('Erreur de réseau ou autre:', error);
    }
  } else {
    // Si le message est vide, affiche une alerte ou un message d'erreur
    alert('Veuillez entrer un message.');
  }
};
