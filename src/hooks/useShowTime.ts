import { useState, useEffect } from 'react';

export const useShowTime = () => {
  const [showTime, setShowTime] = useState(Date.now());

  useEffect(() => {
    updateShowTime();
  }, []);

  const updateShowTime = () => {
    setShowTime(Date.now());
    requestAnimationFrame(updateShowTime);
  };

  return showTime;
};
