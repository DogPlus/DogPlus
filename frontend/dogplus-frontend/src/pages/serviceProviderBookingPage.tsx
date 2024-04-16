import React, { useEffect } from 'react';
import { Datepicker } from "flowbite-react";
import TimePicker from '../components/common/timepicker';
import TimeSelector from '../components/common/timeselector';

export const ServiceProviderBookingPage = () => {
  const [selectedStartTime, setSelectedStartTime]= React.useState<string>("12:00");
  const [selectedTime, setSelectedTime]= React.useState<string | null>(null);
  const [availableTimeslots, setAvailableTimeslots]= React.useState<string[]>([]);

  const onTimeChange = (time: string): any => {
    setSelectedTime(time);
  };

  // TODO: Fetch avaialable times for the selected date
  useEffect(() => {
    // timeslots = fetchAvailableTimes();
    setAvailableTimeslots([]);
  }, [selectedTime]);

  return (
    <div className="m-3">
      <div className="grid grid-cols-2 gap-4 mb-3">
        <Datepicker />
        <TimeSelector selectedTime={selectedStartTime} onTimeChange={setSelectedStartTime} />
      </div>
      <div className="mb-3">
        <TimePicker selectedTime={selectedTime} startTime={selectedStartTime} availableTimes={availableTimeslots} onTimeChange={onTimeChange} />
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
