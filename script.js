const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");

let chatHistory = JSON.parse(localStorage.getItem("chatHistory") || "[]");

// Add message to chat box
function addMessage(sender, text, cls) {
    const messageEl = document.createElement("div");
    messageEl.className = cls;
    messageEl.innerHTML = `<strong>${sender}:</strong> ${text}`;
    chatBox.appendChild(messageEl);
    chatBox.scrollTop = chatBox.scrollHeight;

    chatHistory.push({ role: cls === "user" ? "user" : "assistant", content: text });
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
}

// Clear chat
function clearChat() {
    chatHistory = [];
    localStorage.setItem("chatHistory", JSON.stringify([]));
    chatBox.innerHTML = "";
}

// Send user message to AI
async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    addMessage("You", text, "user");
    userInput.value = "";

    // Show typing indicator
    const typingEl = document.createElement("div");
    typingEl.className = "assistant";
    typingEl.id = "typing";
    typingEl.innerHTML = "Bhumi AI is typing... ✨";
    chatBox.appendChild(typingEl);
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        const response = await fetch("/.netlify/functions/ai", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: localStorage.getItem("username"),
                message: text,
                chatHistory: chatHistory
            })
        });

        const data = await response.json();
        const reply = data.reply || "Aww, I got stuck 😭";

        // Remove typing indicator
        document.getElementById("typing").remove();

        addMessage("Bhumi AI", reply, "assistant");

    } catch (err) {
        document.getElementById("typing").remove();
        addMessage("Bhumi AI", "Server error 😭", "assistant");
        console.error(err);
    }
}

// Optional: send message on Enter key
userInput.addEventListener("keypress", e => {
    if (e.key === "Enter") sendMessage();
});