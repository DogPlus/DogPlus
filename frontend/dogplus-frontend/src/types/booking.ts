import { UserData } from "./user";

export interface BookingData {
  id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  user: UserData;
  serviceProviderName: string;
}
