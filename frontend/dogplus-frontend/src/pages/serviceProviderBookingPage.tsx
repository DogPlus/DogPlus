import React, { useEffect } from 'react';
import { Datepicker } from "flowbite-react";
import TimePicker from '../components/common/timepicker';
import TimeSelector from '../components/common/timeselector';
import { useNavigate, useParams } from 'react-router-dom';
import { Loading } from '../components/common/loading';
import { Service } from '../types/services';
import { toast } from 'react-hot-toast';


function addMinutesToTime(time: string, minutes: number) {
    var parts = time.split(":");
    var hours = Number(parts[0]);
    var mins = Number(parts[1]);

    mins += minutes;
    hours += Math.floor(mins / 60);
    mins %= 60;

    return (hours.toString().padStart(2, '0') + ":" + mins.toString().padStart(2, '0'));
}

export const ServiceProviderBookingPage = () => {
  const [selectedStartTime, setSelectedStartTime]= React.useState<string>("12:00");
  const [selectedDate, setSelectedDate]= React.useState<string>(new Date().toISOString().split('T')[0]); // [YYYY-MM-DD
  const [selectedTime, setSelectedTime]= React.useState<string | null>(null);
  const [availableTimeslots, setAvailableTimeslots]= React.useState<string[] | null>();
  const [serivceTimeInterval, setSerivceTimeInterval]= React.useState<number | null>();
  const [serviceInformation, setServiceInformation]= React.useState<Service>();

  const { id } = useParams();

  const navigate = useNavigate();

  const onTimeChange = (time: string): any => {
    setSelectedTime(time);
  };

  useEffect(() => {
    const fetchAvailableTimes = async () => { 
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_HOST}/api/booking/available/${id}?date=${selectedDate}&start_time=${selectedStartTime}`, {
          method: 'GET',
          headers: {
            'Authorization': `Token ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch available timeslots');
        }
        const data = await response.json();
        setAvailableTimeslots(data.timeslots);
        setSerivceTimeInterval(data.interval);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch available timeslots");
      }
    }
    fetchAvailableTimes();
  }, [selectedStartTime, selectedDate, id]);

  useEffect(() => {
    const fetchServiceInformation = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_HOST}/api/services/${id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Token ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          toast.error('Failed to fetch service interval');
          throw new Error('Failed to fetch service interval');
        }
        const data = await response.json();
        setServiceInformation(data);
      } catch (error) {
        console.error(error);
        toast.error("Oops! Something went wrong on our side!")
      }
    }
    fetchServiceInformation();
  }, [id]);

  const onSubmitBooking = async () => {
    if (!selectedTime) {
      toast("Please select a time slot")
      return;
    }
    if (!serivceTimeInterval) {
      toast.error('Failed to book timeslot. Try to refresh the page.');
      throw new Error('Service time interval not set');
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_HOST}/api/booking/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          booking_date: selectedDate,
          start_time: selectedTime,
          end_time: addMinutesToTime(selectedTime, serivceTimeInterval),
          service: id,
          user: localStorage.getItem("user_id"),
        }),
      });

      if (!response.ok) {
        toast.error('Failed to book timeslot');
        throw new Error('Failed to book timeslot');
      }

      toast.success('Successfully booked timeslot');
      navigate('/serviceproviders');
    } catch (error) {
      console.error(error);
      toast.error('Failed to book timeslot');
    }
  }

  if (!serivceTimeInterval || !availableTimeslots || !serviceInformation) {
    return <Loading />;
  }

  return (
    <div className="m-3">
        <div className="mb-3">
          <h3 className="text-lg font-semibold mb-2">Booking service:</h3>
          <div className="mb-2">
            <h3 className="text-md font-semibold">{serviceInformation.name}</h3>
            <p className="text-gray-600">{serviceInformation.description}</p>
          </div>

          <div className="flex flex-row">
              <div className="flex flex-col gap-2">
                <div className={`flex flex-row gap-4 bg-yellow-100 text-yellow-800 text-md font-medium me-2 px-2.5 py-0.5 rounded-full`}>
                  <div className="fa-clock"/>
                  {serviceInformation.session_time} minutes
                </div>
                <div className={`flex flex-row gap-4 bg-yellow-100 text-yellow-800 text-md font-medium me-2 px-2.5 py-0.5 rounded-full`}>
                  <div className="fa-tag"/>
                  {serviceInformation.fixed_price && (
                    <p>Fixed: {serviceInformation.fixed_price} €</p>
                  )}
                  {serviceInformation.price_per_session && (
                    <p>Per session: {serviceInformation.price_per_session} €</p>
                  )}
                </div>
                <div className={`flex flex-row gap-4 bg-yellow-100 text-yellow-800 text-md font-medium me-2 px-2.5 py-0.5 rounded-full`}>
                  <div className="fa-map-marker"/>
                  {serviceInformation.location} 
                </div>
              </div>
        </div>
        </div>
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
        <TimePicker selectedTime={selectedTime} startTime={selectedStartTime} availableTimes={availableTimeslots} interval={serivceTimeInterval} onTimeChange={onTimeChange} />
      </div>
      <button
        className="w-full px-6 py-5 mb-5 text-sm font-bold leading-none text-white transition duration-300 md:w-96 rounded-2xl hover:bg-accent-600 focus:ring-4 focus:ring-purple-blue-100 bg-accent-0"
        type="submit"
        onClick={onSubmitBooking}
      >
        Book
      </button>
    </div>
  );
};
