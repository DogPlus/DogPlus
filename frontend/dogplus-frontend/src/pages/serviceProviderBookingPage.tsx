import React from 'react';
import { Datepicker } from "flowbite-react";
import TimePicker from '../components/common/timepicker';
import TimeSelector from '../components/common/timeselector';

export const ServiceProviderBookingPage = () => {
  const [selectedStartTime, setSelectedStartTime]= React.useState<string>("12:00");
  const [selectedTime, setSelectedTime]= React.useState<string | null>(null);

  const onTimeChange = (time: string): any => {
    setSelectedTime(time);
  };

  const availableTimes = [
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "11:00",
    "13:30",
    "14:00",
    "16:30",
    "17:00",
    "18:00",
    "18:30",
    "19:30",
    "20:00",
  ];

  return (
    <div className="m-3">
      <h1 className="text-3xl font-bold underline">
        Service Providers Booking 
      </h1>

      <div className="grid grid-cols-2 gap-4 mb-3">
        <Datepicker />
        <TimeSelector selectedTime={selectedStartTime} onTimeChange={setSelectedStartTime} />
      </div>
      <div className="mb-3">
        <TimePicker selectedTime={selectedTime} startTime={selectedStartTime} availableTimes={availableTimes} onTimeChange={onTimeChange} />
      </div>
      <button
        className="w-full px-6 py-5 mb-5 text-sm font-bold leading-none text-white transition duration-300 md:w-96 rounded-2xl hover:bg-purple-blue-600 focus:ring-4 focus:ring-purple-blue-100 bg-purple-blue-500"
        type="submit"
      >
        Book
      </button>
    </div>
  );
};
