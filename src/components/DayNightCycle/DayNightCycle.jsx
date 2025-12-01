import React, { useState, useEffect } from 'react';
import './DayNightCycle.css';

const DayNightCycle = ({ children }) => {
  // Get South African time (SAST - UTC+2)
  const getSouthAfricanTime = () => {
    const now = new Date();
    // Convert to South African time using Intl.DateTimeFormat
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Africa/Johannesburg',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false
    });
    const parts = formatter.formatToParts(now);
    const hour = parseInt(parts.find(p => p.type === 'hour').value);
    const minute = parseInt(parts.find(p => p.type === 'minute').value);
    return hour * 60 + minute; // minutes since midnight
  };

  const [timeOfDay, setTimeOfDay] = useState(getSouthAfricanTime);
  const [isManualMode, setIsManualMode] = useState(false);
  const [manualIsDay, setManualIsDay] = useState(true);

  useEffect(() => {
    // Update every 30 seconds for smoother transitions
    const updateTime = () => {
      setTimeOfDay(getSouthAfricanTime());
    };
    
    // Update immediately
    updateTime();
    
    // Then update every 30 seconds
    const interval = setInterval(updateTime, 30000);

    return () => clearInterval(interval);
  }, []);

  // Calculate star opacity based on time
  // Stars visible during night time: 20:00 to 5:00
  const getStarOpacity = () => {
    if (isManualMode) {
      return manualIsDay ? 0 : 1;
    }
    
    const hour = timeOfDay / 60;
    
    // Night time: 20:00 to 5:00
    if (hour >= 20 || hour < 5) {
      return 1;
    }
    return 0;
  };

  // Get background gradient - only day or night
  const getBackgroundGradient = () => {
    // Day colors (sky blue)
    const dayBlue = 'rgb(135, 206, 235)';
    const dayLightBlue = 'rgb(176, 224, 230)';
    
    // Night colors (dark)
    const nightDark = 'rgb(10, 10, 26)';
    const nightLight = 'rgb(26, 26, 46)';
    
    if (isManualMode) {
      if (manualIsDay) {
        return `linear-gradient(180deg, ${dayLightBlue} 0%, ${dayBlue} 50%, ${dayLightBlue} 100%)`;
      } else {
        return `linear-gradient(180deg, ${nightDark} 0%, ${nightLight} 50%, ${nightDark} 100%)`;
      }
    }
    
    const hour = timeOfDay / 60;
    
    // Day: 5:00 - 20:00 (5 AM to 8 PM)
    if (hour >= 5 && hour < 20) {
      return `linear-gradient(180deg, ${dayLightBlue} 0%, ${dayBlue} 50%, ${dayLightBlue} 100%)`;
    }
    // Night: 20:00 - 5:00 (8 PM to 5 AM)
    else {
      return `linear-gradient(180deg, ${nightDark} 0%, ${nightLight} 50%, ${nightDark} 100%)`;
    }
  };

  const handleToggle = () => {
    if (isManualMode) {
      setManualIsDay(!manualIsDay);
    } else {
      // Switch to manual mode and set opposite of current time
      const hour = timeOfDay / 60;
      const currentlyDay = hour >= 5 && hour < 20;
      setIsManualMode(true);
      setManualIsDay(!currentlyDay);
    }
  };

  const starOpacity = getStarOpacity();
  const backgroundGradient = getBackgroundGradient();

  // Debug: log current time (remove in production)
  useEffect(() => {
    const hour = Math.floor(timeOfDay / 60);
    const minute = timeOfDay % 60;
    console.log(`SA Time: ${hour}:${minute.toString().padStart(2, '0')}, Stars: ${starOpacity.toFixed(2)}`);
  }, [timeOfDay, starOpacity]);

  return (
    <div className="day-night-container">
      <button 
        className="day-night-toggle"
        onClick={handleToggle}
        aria-label="Toggle day/night"
        title={isManualMode ? (manualIsDay ? 'Switch to night' : 'Switch to day') : 'Toggle day/night mode'}
      >
        {isManualMode ? (manualIsDay ? '🌙' : '☀️') : '🔄'}
      </button>
      <div 
        className="day-night-background"
        style={{
          background: backgroundGradient
        }}
      >
        <div 
          className="starry-overlay"
          style={{
            opacity: starOpacity
          }}
        />
      </div>
      <div className="day-night-content">
        {children}
      </div>
    </div>
  );
};

export default DayNightCycle;

