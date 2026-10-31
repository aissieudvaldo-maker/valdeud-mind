const form = document.querySelector("#chat-form");
const input = document.querySelector("#message-input");
const messages = document.querySelector("#messages");
const voiceButton = document.querySelector("#voice-button");

// Envoyer un message à MIND
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const value = input.value.trim();

  if (!value) return;

  // Afficher le message de l'utilisateur
  const message = document.createElement("div");
  message.className = "user-line";
  message.textContent = value;

  messages.appendChild(message);

  input.value = "";

  // Réponse provisoire de MIND
  const reply = document.createElement("div");
  reply.className = "mind-message";

  reply.innerHTML = `
    <span class="mind-avatar">M</span>
    <div>
      <strong>MIND · MODE DÉMO</strong>
      <p>
        Ton message est bien affiché.
        La connexion à une véritable intelligence artificielle
        sera ajoutée dans une prochaine étape.
      </p>
    </div>
  `;

  messages.appendChild(reply);
});

// Dictée vocale
voiceButton.addEventListener("click", () => {

  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert(
      "La dictée vocale n'est pas prise en charge par ce navigateur."
    );
    return;
  }

  const recognition = new SpeechRecognition();

  recognition.lang = "fr-FR";

  recognition.onresult = (event) => {
    input.value = event.results[0][0].transcript;
    input.focus();
  };

  recognition.start();
});
