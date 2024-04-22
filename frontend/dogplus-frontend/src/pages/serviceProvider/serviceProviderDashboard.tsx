import React, { useEffect, useState } from "react";
import {
  ServiceCreationData,
  ServiceData,
  ServicePayload,
} from "../../types/service";
import useUser from "../../hooks/useUser";
import CreateServiceModal from "./createServiceModal";

const ServiceProviderDashboard: React.FC = () => {
  const [service, setService] = useState<ServiceData | undefined>(undefined);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const { user } = useUser();

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
      {!service ? (
        <button
          onClick={() => setModalOpen(true)}
          className="bg-purple-blue-500 hover:bg-purple-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Create Service
        </button>
      ) : (
        <div>
          <h1>{service.name}</h1>
          <p>{service.description}</p>
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
