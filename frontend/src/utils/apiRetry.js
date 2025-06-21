// Utility for retrying API calls with exponential backoff
export const retryApiCall = async (apiCall, maxRetries = 3, baseDelay = 1000) => {
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error;
      
      // Don't retry on certain errors
      if (error.response?.status === 400 || error.response?.status === 401 || error.response?.status === 403) {
        throw error;
      }
      
      // If this is the last attempt, throw the error
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Calculate delay with exponential backoff
      const delay = baseDelay * Math.pow(2, attempt);
      
      // Add some randomness to prevent thundering herd
      const jitter = Math.random() * 200;
      
      console.log(`API call failed, retrying in ${delay + jitter}ms (attempt ${attempt + 1}/${maxRetries + 1})`);
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay + jitter));
    }
  }
  
  throw lastError;
};

// Enhanced fetch with retry logic
export const fetchWithRetry = async (url, options = {}, maxRetries = 3) => {
  return retryApiCall(async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }, maxRetries);
};

// Enhanced axios with retry logic
export const axiosWithRetry = async (axiosInstance, config, maxRetries = 3) => {
  return retryApiCall(async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    try {
      const response = await axiosInstance({
        ...config,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }, maxRetries);
}; 