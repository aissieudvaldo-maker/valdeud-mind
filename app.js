
const form = document.querySelector("#chat-form");
const input = document.querySelector("#message-input");
const messages = document.querySelector("#messages");
const voiceButton = document.querySelector("#voice-button");

const MIND_API = "https://valdeud-mind-core.onrender.com/api/mind/message";

// Afficher un message
function addMessage(content, className, isHTML = false) {
  const element = document.createElement("div");
  element.className = className;

  if (isHTML) {
    element.innerHTML = content;
  } else {
    element.textContent = content;
  }

  messages.appendChild(element);
  messages.scrollTop = messages.scrollHeight;

  return element;
}

// Envoyer un message au véritable MIND
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const value = input.value.trim();
  if (!value) return;

  addMessage(value, "user-line");

  input.value = "";
  input.disabled = true;

  const reply = addMessage(
    `<span class="mind-avatar">M</span>
     <div>
       <strong>MIND · RÉFLEXION</strong>
       <p>MIND réfléchit à ta demande...</p>
     </div>`,
    "mind-message",
    true
  );

  try {
    const response = await fetch(MIND_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: value
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Erreur du serveur.");
    }

    reply.innerHTML = "";

    const avatar = document.createElement("span");
    avatar.className = "mind-avatar";
    avatar.textContent = "M";

    const content = document.createElement("div");

    const title = document.createElement("strong");
    title.textContent = "MIND · INTELLIGENCE ACTIVE";

    const paragraph = document.createElement("p");
    paragraph.textContent = data.response;

    content.appendChild(title);
    content.appendChild(paragraph);

    reply.appendChild(avatar);
    reply.appendChild(content);

  } catch (error) {
    reply.innerHTML = "";

    const avatar = document.createElement("span");
    avatar.className = "mind-avatar";
    avatar.textContent = "M";

    const content = document.createElement("div");
    const title = document.createElement("strong");
    title.textContent = "MIND · CONNEXION";

    const paragraph = document.createElement("p");
    paragraph.textContent =
      error.message || "Impossible de joindre MIND. Réessaie.";

    content.appendChild(title);
    content.appendChild(paragraph);

    reply.appendChild(avatar);
    reply.appendChild(content);

  } finally {
    input.disabled = false;
    input.focus();
  }
});

// Dictée vocale
voiceButton.addEventListener("click", () => {
  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("La dictée vocale n'est pas prise en charge par ce navigateur.");
    return;
  }

  const recognition = new SpeechRecognition();

  recognition.lang = "fr-FR";
  recognition.interimResults = false;

  recognition.onresult = (event) => {
    input.value = event.results[0][0].transcript;
    input.focus();
  };

  recognition.onerror = () => {
    alert("La reconnaissance vocale a rencontré un problème.");
  };

  recognition.start();
});
