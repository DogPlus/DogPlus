import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Loading } from "../components/common/loading";
import { Label } from "../components/label";
import { BookingsOverview } from "../components/serviceProvider/BookingsOverview";
import useUser from "../hooks/useUser";
import { ServiceCreationData, ServicePayload } from "../types/service";
import { Service } from "../types/services";

const ServiceProviderServiceDashboard: React.FC = () => {
  const [service, setService] = useState<Service | undefined>(undefined);
  const [serviceDescription, setServiceDescription] = useState<string | undefined>();
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      fetchService();
    }
  }, [user]);

  const fetchService = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_HOST}/api/services/service/service_provider/${user?.id}/`,
        {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );


      if (!response.ok) {
        setService(undefined);
        throw new Error("Failed to fetch service");
      }

      const data = await response.json();
      setService(data);
    } catch (error) {
      console.error("Error fetching service:", error);
      toast.error("Failed to fetch service");
    }
  };


  if(!service) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold">{service.name}</h1>
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <h3 className="text-lg font-semibold">General information</h3>
        <p className="text-gray-700 mb-4">Here you can find general information about your service. As of now, edits are not allowed. Please contact the Dog+ team if you wish to edit some fields</p>
        
      <div className="mb-2">
        <h3 className="text-md font-semibold">{service.name}</h3>
        <p className="text-gray-600">{service.description}</p>
      </div>
      <div className="flex flex-row">
          
          <div className="flex flex-col gap-2">
            <Label icon="fa-clock" color="yellow" text={`${service.session_time} minutes`}/>
            <Label icon="fa-tag" color="yellow" text={service.fixed_price ? `Fixed: ${service.fixed_price} €` : `Per Session: ${service.price_per_session} €`}/>
            <Label icon="fa-map-marker" color="yellow" text={service.location}/>
          </div>
      </div>
          
        <h3 className="text-lg font-semibold">Overview of bookings</h3>
          <BookingsOverview />
        </div>
    </div>
  );
};

export default ServiceProviderServiceDashboard;
