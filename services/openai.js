const axios = require('axios');

class OpenAIService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseURL = 'https://api.openai.com/v1';
  }

  async generateResponse(prompt) {
    try {
      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API Error:', error.response?.data || error.message);
      throw new Error('Maaf, terjadi kesalahan saat memproses permintaan AI. Silakan coba lagi.');
    }
  }
}

module.exports = OpenAIService;
