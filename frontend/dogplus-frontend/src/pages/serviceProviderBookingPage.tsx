import React, { useEffect } from 'react';
import { Datepicker } from "flowbite-react";
import TimePicker from '../components/common/timepicker';
import TimeSelector from '../components/common/timeselector';
import { useParams } from 'react-router-dom';

export const ServiceProviderBookingPage = () => {
  const [selectedStartTime, setSelectedStartTime]= React.useState<string>("12:00");
  const [selectedDate, setSelectedDate]= React.useState<string>(new Date().toISOString().split('T')[0]); // [YYYY-MM-DD
  const [selectedTime, setSelectedTime]= React.useState<string | null>(null);
  const [availableTimeslots, setAvailableTimeslots]= React.useState<string[]>([]);

  const { id } = useParams();

  const onTimeChange = (time: string): any => {
    setSelectedTime(time);
  };

  // TODO: Fetch avaialable times for the selected date
  useEffect(() => {
    const fetchAvailableTimes = async () => { 
      // Fetch available timeslots for the selected date
      try {
        const response = await fetch(`api/booking/available/${id}?date=${selectedDate}&start_time=${selectedStartTime}`, {
          method: 'GET',
          headers: {
            'Authorization': `Token ${localStorage.getItem("token")}}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch available timeslots');
        }
        const data = await response.json();
        setAvailableTimeslots(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchAvailableTimes();
  }, [selectedStartTime, selectedDate, id]);

  return (
    <div className="m-3">
      <div className="grid grid-cols-2 gap-4 mb-3">
        <Datepicker 
          onSelectedDateChanged={(date) => {
            const selectedDate = new Date(date);
            const year = selectedDate.getFullYear();
            const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
            const day = String(selectedDate.getDate()).padStart(2, '0');
            const formattedDate = `${year}-${month}-${day}`;
            setSelectedDate(formattedDate);
          }}
        />
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
