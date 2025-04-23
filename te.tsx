  return (
    <div style={styles.container}>
      <h2>Bienvenue 👋</h2>
      <p>Veuillez choisir votre langue pour démarrer la conversation :</p>

      <div style={styles.buttonGroup}>
        <button
          style={selectedLang === "fr" ? styles.activeButton : styles.button}
          onClick={() => handleSelect("fr")}
        >
          🇫🇷 Français
        </button>

        <button
          style={selectedLang === "en" ? styles.activeButton : styles.button}
          onClick={() => handleSelect("en")}
        >
          🇺🇸 English
        </button>
      </div>

      <button
        onClick={handleStart}
        disabled={!selectedLang}
        style={{
          ...styles.startButton,
          opacity: selectedLang ? 1 : 0.5,
          cursor: selectedLang ? "pointer" : "not-allowed",
        }}
      >
        Démarrer la conversation 💬
      </button>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    textAlign: "center",
    padding: "2rem",
    maxWidth: "400px",
    margin: "auto",
    fontFamily: "Arial, sans-serif",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "center",
    gap: "1rem",
    margin: "1rem 0",
  },
  button: {
    padding: "0.6rem 1.2rem",
    fontSize: "1rem",
    borderRadius: "5px",
    border: "1px solid #ccc",
    backgroundColor: "#f0f0f0",
    cursor: "pointer",
  },
  activeButton: {
    padding: "0.6rem 1.2rem",
    fontSize: "1rem",
    borderRadius: "5px",
    border: "2px solid #007bff",
    backgroundColor: "#e6f0ff",
    cursor: "pointer",
  },
  startButton: {
    marginTop: "1.5rem",
    padding: "0.8rem 2rem",
    fontSize: "1rem",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
  },
};

export default StartConversation;
