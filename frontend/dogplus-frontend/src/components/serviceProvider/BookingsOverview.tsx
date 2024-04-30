import { useEffect, useState } from "react";
import useUser from "../../hooks/useUser";
import { BookingData } from "../../types/booking";
import { ServiceData } from "../../types/service";
import { Loading } from "../common/loading";
import { addDays, format, parseISO } from "date-fns";
import ConfirmModal from "../ConfirmModal";
import { toast } from "react-hot-toast";

interface DashboardData {
  service: ServiceData | null;
  bookings: BookingData[];
}

export const BookingsOverview = () => {
  const { user } = useUser();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<
    string | undefined
  >();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_HOST}/api/services/dashboard/`,
          {
            method: "GET",
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          toast.error("Oops! Something went wrong on our side!")
          throw new Error("Failed to fetch service and booking data");
        }

        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        console.error(error);
        toast.error("Oops! Something went wrong on our side!")
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const handleDeleteBooking = async (bookingId: string) => {
    console.log("Deleting booking with id: ", bookingId);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_HOST}/api/booking/${bookingId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        toast.error("Oops! Could not delete booking. Please try again later.")
        throw new Error("Failed to delete booking");
      }

      if (!dashboardData) return;
      setDashboardData({
        ...dashboardData,
        bookings: dashboardData.bookings.filter(
          (booking) => booking.id !== bookingId
        ),
      });
      setModalOpen(false);
    } catch (error) {
      console.error("Error deleting booking:", error);
      toast.error("Oops! Could not delete booking. Please try again later.")
    }
  };

  const handleNextDay = () => {
    setSelectedDate(addDays(selectedDate, 1));
  };

  const handlePreviousDay = () => {
    if (format(selectedDate, "yyyy-MM-dd") > format(new Date(), "yyyy-MM-dd")) {
      setSelectedDate(addDays(selectedDate, -1));
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), "PP");
    } catch (error) {
      console.error("Error formatting date: ", error);
      toast.error("Oops! Something went wrong on our side!")
      return dateStr;
    }
  };

  const formatTime = (timeStr: string) => {
    try {
      const dummyDate = `1970-01-01T${timeStr}`;
      return format(parseISO(dummyDate), "p").replace(":00", "");
    } catch (error) {
      console.error("Error formatting time: ", error);
      toast.error("Oops! Something went wrong on our side!")
      return timeStr;
    }
  };

  const bookingsForSelectedDate = dashboardData
    ? dashboardData.bookings.filter((booking) => {
        return (
          format(parseISO(booking.booking_date), "yyyy-MM-dd") ===
          format(selectedDate, "yyyy-MM-dd")
        );
      })
    : [];

  const openModal = (bookingId: string) => {
    setModalOpen(true);
    setSelectedBookingId(bookingId);
  };

  if (loading) return <Loading />;
  if (!dashboardData)
    return (
      <div className="text-gray-900 bg-gray-200 p-4 rounded-lg shadow">
        No data available.
      </div>
    );
  return (
    <div className="m-3 p-4 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePreviousDay}
          disabled={
            format(selectedDate, "yyyy-MM-dd") <=
            format(new Date(), "yyyy-MM-dd")
          }
        >
          ←
        </button>

        <p>{formatDate(format(selectedDate, "yyyy-MM-dd"))}</p>
        <button onClick={handleNextDay}>→</button>
      </div>
      {bookingsForSelectedDate.length > 0 ? (
        bookingsForSelectedDate.map((booking) => (
          <div
            key={booking.id}
            className="p-4 mb-3 bg-gray-100 rounded-md border border-gray-300 flex justify-between items-center"
          >
            <div>
              <p className="text-gray-700">
                <strong>User:</strong> {booking.user.username}
              </p>
              <p className="text-gray-700">
                <strong>Date:</strong> {formatDate(booking.booking_date)}
              </p>
              <p className="text-gray-700">
                <strong>Time:</strong> {formatTime(booking.start_time)} -{" "}
                {formatTime(booking.end_time)}
              </p>
            </div>
            <button
              onClick={() => openModal(booking.id)}
              className="text-red-500 hover:text-red-700"
            >
              <i className="fas fa-trash"></i>
            </button>
          </div>
        ))
      ) : (
        <p className="text-gray-600">
          No bookings available for selected date.
        </p>
      )}
      <ConfirmModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={() => handleDeleteBooking(selectedBookingId ?? "")}
      />
    </div>
  );
};
