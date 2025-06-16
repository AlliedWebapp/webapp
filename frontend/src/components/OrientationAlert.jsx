import React, { useEffect, useState } from 'react';

const OrientationAlert = () => {
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
      
      
      const isSmallScreen = window.innerWidth <= 1024;
    
      const isPortrait = window.innerHeight > window.innerWidth;

      setShowAlert((isMobileDevice || isSmallScreen) && isPortrait);
    };

   
    checkOrientation();

    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  if (!showAlert) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: '#2196F3',
        color: 'white',
        padding: '8px',
        textAlign: 'center',
        zIndex: 1000,
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        fontSize: '14px'
      }}
    >
      Please rotate your device to landscape mode for better view.
    </div>
  );
};

export default OrientationAlert; 