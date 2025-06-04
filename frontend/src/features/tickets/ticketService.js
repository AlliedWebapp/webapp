import axios from 'axios'

const API_URL = `${process.env.REACT_APP_API_BASE_URL}/api/tickets/`;

// Cache for tickets
let ticketsCache = null;
let lastFetchTime = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Create new ticket
const createTicket = async (ticketData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  const response = await axios.post(API_URL, ticketData, config)
  // Invalidate cache when new ticket is created
  ticketsCache = null;
  return response.data
}

// Get user tickets with caching
const getTickets = async token => {
  // Check if we have a valid cache
  const now = Date.now();
  if (ticketsCache && lastFetchTime && (now - lastFetchTime < CACHE_DURATION)) {
    return ticketsCache;
  }

  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  try {
    const response = await axios.get(API_URL, config);
    // Update cache
    ticketsCache = response.data;
    lastFetchTime = now;
    return response.data;
  } catch (error) {
    // If there's an error but we have cached data, return it
    if (ticketsCache) {
      console.warn('Using cached tickets due to fetch error:', error);
      return ticketsCache;
    }
    throw error;
  }
}

// Get user ticket
const getTicket = async (ticketId, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    const response = await axios.get(API_URL + ticketId, config);
    
    if (response.status === 200 && response.data) {
      return response.data;
    } else {
      throw new Error('Invalid response from server');
    }
  } catch (error) {
    console.error('Error in getTicket:', error);
    throw error;
  }
};

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
  
  // Invalidate cache when ticket is closed
  ticketsCache = null;
  return response.data
}

// Clear cache
const clearCache = () => {
  ticketsCache = null;
  lastFetchTime = null;
}

const ticketService = {
  createTicket,
  getTickets,
  getTicket,
  closeTicket,
  clearCache
}

export default ticketService
