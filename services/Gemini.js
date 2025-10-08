const axios = require('axios');

class GeminiService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseURL = 'https://generativelanguage.googleapis.com/v1beta';
  }

  async generateImage(prompt) {
    try {
      // Untuk Gemini, kita akan menggunakan model generateContent
      // Note: Gemini Veo 3 untuk video generation memerlukan setup khusus
      // Untuk sementara kita fokus ke text-to-image generation
      const response = await axios.post(
        `${this.baseURL}/models/gemini-pro:generateContent?key=${this.apiKey}`,
        {
          contents: [
            {
              parts: [
                {
                  text: `Buatkan deskripsi visual untuk: ${prompt}`
                }
              ]
            }
          ]
        }
      );

      const description = response.data.candidates[0].content.parts[0].text;
      
      // Karena Gemini API untuk image generation terbatas, kita return deskripsi
      // Di production, bisa diintegrasikan dengan API image generation lain
      return {
        type: 'text',
        content: `🎨 **Deskripsi Visual:**\n${description}\n\n*Note: Fitur image generation sedang dalam pengembangan lebih lanjut.*`
      };
    } catch (error) {
      console.error('Gemini API Error:', error.response?.data || error.message);
      throw new Error('Maaf, terjadi kesalahan saat memproses permintaan Gemini. Silakan coba lagi.');
    }
  }
}

module.exports = GeminiService;
