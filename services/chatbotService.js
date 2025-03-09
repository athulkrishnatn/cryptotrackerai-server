const axios = require("axios");
require("dotenv").config();

const getChatbotResponse = async (question) => {
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`, 
      {
        contents: [{ role: "user", parts: [{ text: question }] }],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("🔹 Gemini API Response:", response.data);

    if (response.data.candidates && response.data.candidates.length > 0) {
      return response.data.candidates[0].content.parts[0].text;
    } else {
      return "Sorry, I couldn't fetch the response. Try again later!";
    }
  } catch (error) {
    console.error("❌ Gemini API Error:", error.response?.data || error.message);
    return "Something went wrong while fetching the chatbot response!";
  }
};

module.exports = { getChatbotResponse };
