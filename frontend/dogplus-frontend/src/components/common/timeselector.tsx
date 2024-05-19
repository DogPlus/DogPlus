import React, { useState } from 'react';

interface TimeSelectorProps {
  selectedTime: string;
  timeInterval: number;
  onTimeChange: (time: string) => void;
}

const TimeSelector: React.FC<TimeSelectorProps> = ({ selectedTime, timeInterval, onTimeChange}) => {

  const generateTimeOptions = (): string[] => {
    const options: string[] = [];
    for (let hour = 7; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += timeInterval) {
        const formattedHour = hour.toString().padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');
        options.push(`${formattedHour}:${formattedMinute}`);
      }
    }
    return options;
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onTimeChange(e.target.value); 
  };

  return (
    <div>
      <select
        id="time"
        className="block w-full bg-gray-50 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        value={selectedTime}
        onChange={handleChange}
      >
        {generateTimeOptions().map((time) => (
          <option key={time} value={time}>
            {time}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TimeSelector;

