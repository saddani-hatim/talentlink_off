import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_AI_SERVICE_URL || 'http://localhost:2021/api/ai';

export const chatWithAI = async (message: string, history: any[] = []) => {
  try {
    const response = await axios.post(`${API_URL}/chat`, {
      message,
      history
    });
    return response.data;
  } catch (error: any) {
    console.error('AICoach Service Error:', error);
    if (error.response && error.response.status === 429) {
      throw new Error("L'IA est momentanément surchargée. Veuillez patienter 30 secondes.");
    }
    throw error;
  }
};
