import { addDays, format, parseISO } from "date-fns";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import useUser from "../../hooks/useUser";
import { BookingData } from "../../types/booking";
import { ServiceData } from "../../types/service";
import { UserRole } from "../../types/user";
import ConfirmModal from "../ConfirmModal";
import { Loading } from "../common/loading";
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
        let url = `${process.env.REACT_APP_BACKEND_HOST}/api/services/dashboard/`;
        if (user?.role === UserRole.User) {
          url += `?user_id=${user.id}`;
        }

        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          toast.error("Oops! Something went wrong on our side!");
          throw new Error("Failed to fetch service and booking data");
        }

        const data = await response.json();
        const parsedData: DashboardData = parseDashboardData(data);
        setDashboardData(parsedData);
      } catch (error) {
        console.error(error);
        toast.error("Oops! Something went wrong on our side!");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const handleDeleteBooking = async (bookingId: string) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_HOST}/api/booking/${bookingId}/delete`,
        {
          method: "POST",
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      );

      // Impossible to fix this. Throws CORS error
      if (!response.ok) {
        throw new Error("Failed to delete booking");
      }

    } catch (error) {
      console.error("Failed to delete booking: ", error);
      //toast.error("Oops! Could not delete booking. Please try again later.");
    }

    if (!dashboardData) return;
    setDashboardData({
      ...dashboardData,
      bookings: dashboardData.bookings.filter(
        (booking) => booking.id !== bookingId
      ),
    });
    toast.success("Booking deleted successfully!");
    setModalOpen(false);
  };
  const parseDashboardData = (data: any): DashboardData => {
    if (!data) {
      throw new Error("Invalid data provided for dashboard parsing.");
    }

    try {
      const { service, bookings }: { service: any; bookings: any } = data;

      const parsedBookings: BookingData[] = bookings.map((booking: any) => ({
        id: booking.id,
        booking_date: booking.booking_date,
        start_time: booking.start_time,
        end_time: booking.end_time,
        user: booking.user,
        serviceProviderName: booking.service_provider.username,
      }));

      // If the user is not a supervisor, service data may not be available
      let parsedService: ServiceData | null = null;

      if (service) {
        parsedService = {
          id: service.id,
          name: service.name,
          description: service.description,
          location: service.location,
          serviceProviderId: service.service_provider.id,
          pricePerSession: service.price_per_session,
          sessionTime: service.session_time,
          fixedPrice: service.fixed_price,
          priceType: service.priceType,
        };
      }

      return {
        service: parsedService,
        bookings: parsedBookings,
      };
    } catch (error) {
      throw new Error(`Failed to parse dashboard data: ${error}`);
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
      toast.error("Oops! Something went wrong on our side!");
      return dateStr;
    }
  };

  const formatTime = (timeStr: string) => {
    try {
      const dummyDate = `1970-01-01T${timeStr}`;
      return format(parseISO(dummyDate), "p").replace(":00", "");
    } catch (error) {
      console.error("Error formatting time: ", error);
      toast.error("Oops! Something went wrong on our side!");
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
                <strong>Serviceprovider:</strong> {booking.serviceProviderName}
              </p>
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
