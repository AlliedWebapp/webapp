import axios from 'axios'

const API_URL = '/api/tickets/';

// Get ticket notes
const getNotes = async (ticketId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }

  const response = await axios.get(`${API_URL}${ticketId}/notes`, config); // GET /api/notes/:ticketId

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
    `${API_URL}${ticketId}/notes`, // ✅ POST to /api/tickets/:ticketId/notes
    { text: noteText }, // ✅ Body matches expected format
    config
  );
  return response.data
}

const noteService = {
  getNotes,
  createNote
}

export default noteService
