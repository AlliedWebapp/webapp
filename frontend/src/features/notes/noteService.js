import axios from 'axios'

const API_URL = '/api/notes/'

// Get ticket notes
const getNotes = async (ticketId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }

  const response = await axios.get(`${API_URL}/${ticketId}`, config); // GET /api/notes/:ticketId

  return response.data;
}

// Create ticket note
const createNote = async ({ noteText, ticketId }, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }

  const response = await axios.post(
    API_URL, // POST to /api/notes
    {
      ticketId: ticketId,  // 👈 ticketId goes in body, not URL
      text: noteText,
    },
    config
  );
  return response.data
}

const noteService = {
  getNotes,
  createNote
}

export default noteService
