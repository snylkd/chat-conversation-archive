const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (message.trim() || fileAttachment) {
    // Appeler l'API avec les données du message et du fichier, si nécessaire
    try {
      // Exemple de requête POST à l'API (adapte l'URL et le format selon ton API)
      const response = await fetch('https://api.example.com/sendMessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message.trim(),
          file: fileAttachment, // Si tu as un fichier à envoyer, adapte selon l'API
        }),
      });

      // Vérifier si la réponse est correcte
      if (response.ok) {
        const data = await response.json();

        // Réponse de l'API, renvoyer cette réponse dans la conversation
        onSendMessage(data.reply || 'Réponse vide de l\'API', fileAttachment || undefined);
      } else {
        console.error('Erreur lors de l\'appel à l\'API', response.statusText);
      }
    } catch (error) {
      console.error('Erreur de réseau ou autre', error);
    }

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
