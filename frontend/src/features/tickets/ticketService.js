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
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  }

  try {
    console.log(`Making request to: ${API_URL + ticketId}`);
    const response = await axios.get(API_URL + ticketId, config);
    
    if (!response.data) {
      throw new Error('No data received from server');
    }
    
    console.log('Response data:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching ticket:', error);
    if (error.response) {
      console.error('Error response:', error.response.data);
      throw new Error(error.response.data.message || 'Failed to fetch ticket');
    }
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
