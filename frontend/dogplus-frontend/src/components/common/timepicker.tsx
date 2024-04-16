import React from "react";

interface TimePickerProps {
  selectedTime: string | null;
  availableTimes: string[];
  startTime: string;
  interval: number;
  onTimeChange: (time: string) => void;
}

const TimePicker: React.FC<TimePickerProps> = ({ selectedTime, availableTimes, startTime, interval, onTimeChange }) => {
  // Generating time slots from 08:00 to 20:00 in 30-minute intervals
  const generateTimeSlots = (): string[] => {
    const start_hour = parseInt(startTime.split(":")[0]);
    const start_minute = parseInt(startTime.split(":")[1]);
    const timeSlots: string[] = [];
    for (let hour = start_hour; hour <= 20; hour++) {
      for (let minute = start_minute; minute < 60; minute += interval) {
        const formattedHour = hour.toString().padStart(2, "0");
        const formattedMinute = minute.toString().padStart(2, "0");
        const time = `${formattedHour}:${formattedMinute}`;
        timeSlots.push(time);
      }
    }
    return timeSlots;
  };

  // Check if a time slot is available
  const isAvailable = (time: string): boolean => {
    // You can implement your own logic to check availability here
    // For demonstration purposes, let's consider all time slots available
    return availableTimes.includes(time);
  };

  return (
    <div className="grid grid-cols-4 gap-2">
      {generateTimeSlots().map((time) => (
        <button
          key={time}
          className={`p-2 text-center rounded-md ${
            selectedTime === time ? "bg-purple-blue-500 text-white" : "bg-gray-200"
          } ${!isAvailable(time) && "opacity-50 cursor-not-allowed"}`}
          onClick={() => isAvailable(time) && onTimeChange(time)}
          disabled={!isAvailable(time)}
        >
          {time}
        </button>
      ))}
    </div>
  );
};

export default TimePicker;
