const chatbotService = require("../services/chatbotService");

const askChatbot = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: "Question is required!" });
    }

    const response = await chatbotService.getChatbotResponse(question);

    res.status(200).json({ response });
  } catch (error) {
    console.error("Chatbot Error:", error);
    res.status(500).json({ error: "Something went wrong!" });
  }
};

module.exports = { askChatbot };
