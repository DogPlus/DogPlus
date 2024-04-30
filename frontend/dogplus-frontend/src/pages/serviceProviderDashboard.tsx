import React, { useEffect, useState } from "react";
import useUser from "../hooks/useUser";
import {
  ServiceCreationData,
  ServicePayload,
} from "../types/service";
import CreateServiceModal from "../components/serviceProvider/CreateServiceModal";
import ServiceDisplay from "../components/serviceProvider/ServiceDisplay";
import { BookingsOverview } from "../components/serviceProvider/BookingsOverview";
import { ServiceCard } from "../components/ServiceCard";
import { Service } from "../types/services";
import { useNavigate } from "react-router-dom";

const ServiceProviderDashboard: React.FC = () => {
  const [service, setService] = useState<Service | undefined>(undefined);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const { user } = useUser();
  const navigate = useNavigate();

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

  const handleSaveService = async (serviceData: ServiceCreationData) => {
    try {
      const token = localStorage.getItem("token");

      let payload: ServicePayload = {
        name: serviceData.name,
        description: serviceData.description,
        location: serviceData.location,
      };

      if ("pricePerSession" in serviceData) {
        payload.price_per_session = serviceData.pricePerSession;
        payload.session_time = serviceData.sessionTime;
      } else if ("fixedPrice" in serviceData) {
        payload.fixed_price = serviceData.fixedPrice;
      }

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_HOST}/api/services/${user?.id}/service/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to create service:", errorData);
        throw new Error(
          "Failed to create service: " + JSON.stringify(errorData)
        );
      }

      const data = await response.json();
      console.log("Service created successfully:", data);
      setService(data);
      setModalOpen(false);
    } catch (error) {
      console.error("Error creating service:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold">Service Provider Dashboard</h1>
      <p className="text-gray-600">Here you can manage your services and bookings</p>
      <h1 className="text-lg font-semibold">Your services</h1>
      {!service ? (
        <button
          onClick={() => setModalOpen(true)}
          className="bg-purple-blue-500 hover:bg-purple-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Create Service
        </button>
      ) : (
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">

          <ServiceCard  serviceProviderService={service} onClick={() => navigate(`/serviceprovider/dashboard/service/${service.id}`) } />
        </div>
      )}
      {user && (
        <CreateServiceModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSaveService}
          serviceProviderId={user.id}
        />
      )}
    </div>
  );
};

export default ServiceProviderDashboard;
