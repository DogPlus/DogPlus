import React, { useEffect, useState } from "react";
import { ServiceCreationData, ServiceData } from "../../types/service";
import useUser from "../../hooks/useUser";
import CreateServiceModal from "./createServiceModal";

const ServiceProviderDashboard: React.FC = () => {
  const [service, setService] = useState<ServiceData | undefined>(undefined);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const { user } = useUser();

  const handleSaveService = async (serviceData: ServiceCreationData) => {
    try {
      const response = await fetch(
        `/api/service-provider/${user?.id}/service`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(serviceData),
        }
      );
      if (!response.ok) throw new Error("Failed to create service");
      const data: ServiceData = await response.json();
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
