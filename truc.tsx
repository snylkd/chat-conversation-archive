const handleSubmit = async (e: React.FormEvent) => {  // Modifié en React.FormEvent car tu envoies un formulaire, pas un champ input
  e.preventDefault();

  // On vérifie si le message existe
  if (!message.trim()) {
    alert("Le message ne peut pas être vide.");
    return;
  }

  // Envoi du message et du fichier (s'il y en a un)
  onSendMessage(message.trim(), fileAttachment || undefined);

  // Création de FormData pour l'envoi du formulaire
  const formData = new FormData();
  formData.append('message', message.trim());
  formData.append('cid', cid);

  // Si un fichier est attaché, on l'ajoute au FormData
  if (fileAttachment) {
    try {
      const file = await fetch(fileAttachment.url).then((res) => res.blob());
      formData.append('file', file, fileAttachment.name);
    } catch (error) {
      console.error('Erreur lors de la récupération du fichier :', error);
    }
  }

  // Envoi de la requête à l'API
  try {
    const response = await fetch('http://127.0.0.1:800/chat', {
      method: 'POST',
      body: formData,
    });

    // Si la réponse est correcte
    if (response.ok) {
      const data = await response.json();
      // Appel de onSendMessage avec la réponse de l'API
      onSendMessage(data.reply || 'Réponse vide de l\'API', fileAttachment || undefined);
    } else {
      const errorData = await response.json();
      console.error('Erreur dans la réponse de l\'API :', errorData);
    }
  } catch (error) {
    console.error('Erreur lors de l\'appel à l\'API :', error);
  }

  // Réinitialisation des champs
  setMessage('');
  setFileAttachment(null);
  setIsTyping(false);
};
