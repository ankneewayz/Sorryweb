import { OpenRouter } from "@openrouter/sdk";

export const handler = async (event, context) => {
  try {
    const body = JSON.parse(event.body || "{}");
    const userMessage = body.message || "";
    const oldHistory = body.chatHistory || [];

    const formattedHistory = oldHistory.map(msg => ({
      role: msg.sender === "You" ? "user" : "assistant",
      content: msg.text
    }));

    // ✅ API key directly in code (less secure)
    const openrouter = new OpenRouter({
      apiKey: "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"
    });

    const response = await openrouter.chat.send({
      model: "amazon/nova-2-lite-v1:free",
      messages: [
        {
          role: "system",
          content: `
You are Bhumi’s Personal AI Assistant 🎀✨
Make her happy with short, cute, friendly replies with emojis.
          `
        },
        ...formattedHistory,
        { role: "user", content: userMessage }
      ]
    });

    const aiReply = response.choices?.[0]?.message?.content;

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: aiReply || "Aww, I got stuck 😭" })
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ reply: "Server error 😭" })
    };
  }
};