import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/best-move';

const chessApi = {
   getBestMove: async (fenString, thinkTime = "2") => {
    try {
      const response = await axios.post(API_BASE_URL, {
        fen: fenString,
        time: thinkTime,
      });
      console.log('Response from server:', response.data);
      return response.data; 

    } catch (error) {
      throw new Error(`Failed to get best move: ${error.message}`);
    }
  },
};

export default chessApi;