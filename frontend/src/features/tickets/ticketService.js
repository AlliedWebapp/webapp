import axios from 'axios'

const API_URL = `${process.env.REACT_APP_API_BASE_URL}/api/tickets/`;


// Create new ticket
const createTicket = async (ticketData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  const response = await axios.post(API_URL, ticketData, config)

  return response.data
}

// Get user tickets
const getTickets = async token => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  const response = await axios.get(API_URL, config)

  return response.data
}

// Get user ticket
const getTicket = async (ticketId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    withCredentials: true
  }

  try {
    console.log(`Making request to: ${API_URL + ticketId}`);
    console.log('Request config:', config);
    const response = await axios.get(API_URL + ticketId, config);
    console.log('Response data:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching ticket:', error);
    console.error('Error response:', error.response);
    throw error;
  }
}

// Close ticket
const closeTicket = async (ticketId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  const response = await axios.put(
    API_URL + ticketId,
    { status: 'close' },
    config
  )

  return response.data
}

const ticketService = {
  createTicket,
  getTickets,
  getTicket,
  closeTicket
}

export default ticketService
