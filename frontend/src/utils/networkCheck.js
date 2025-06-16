export function checkNetworkSpeed(callback) {
  try {
    if ('connection' in navigator) {
      const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      
      if (!conn) {
        console.warn('Network Information API not available');
        callback(false);
        return;
      }

      const updateStatus = () => {
        try {
          
          const isSlowConnection = 
            conn.downlink < 2 || 
            ['slow-2g', '2g', '3g'].includes(conn.effectiveType) ||
            conn.rtt > 200 || 
            conn.downlink < 1.5; 

          callback(isSlowConnection);
        } catch (error) {
          console.error('Error checking network status:', error);
          callback(false);
        }
      };

      updateStatus();

   
      if (conn.addEventListener) {
        conn.addEventListener('change', updateStatus);
      }

     
      return () => {
        if (conn.removeEventListener) {
          conn.removeEventListener('change', updateStatus);
        }
      };
    } else {
      console.warn('Network Information API not supported in this browser');
      callback(false);
    }
  } catch (error) {
    console.error('Error in network check:', error);
    callback(false);
  }
}
