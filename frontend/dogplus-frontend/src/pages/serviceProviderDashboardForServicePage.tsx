import { Label, Textarea } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { Loading } from "../components/common/loading";
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
            <div className={`flex flex-row gap-4 bg-yellow-100 text-yellow-800 text-md font-medium me-2 px-2.5 py-0.5 rounded-full`}>
              <div className="fa-clock"/>
              {service.session_time} minutes
            </div>
            <div className={`flex flex-row gap-4 bg-yellow-100 text-yellow-800 text-md font-medium me-2 px-2.5 py-0.5 rounded-full`}>
              <div className="fa-tag"/>
              {service.fixed_price && (
                <p>Fixed: {service.fixed_price} €</p>
              )}
              {service.price_per_session && (
                <p>Per session: {service.price_per_session} €</p>
              )}
            </div>
            <div className={`flex flex-row gap-4 bg-yellow-100 text-yellow-800 text-md font-medium me-2 px-2.5 py-0.5 rounded-full`}>
              <div className="fa-map-marker"/>
              {service.location} 
            </div>
          </div>
      </div>
          
        <h3 className="text-lg font-semibold">Overview of bookings</h3>
          <BookingsOverview />
        </div>
    </div>
  );
};

export default ServiceProviderServiceDashboard;
