import { useEffect, useState } from "react";
import { ServiceData } from "../../types/service";
import useUser from "../../hooks/useUser";

const ServiceProviderDashboard = () => {
  const [service, setService] = useState<ServiceData | undefined>(undefined);
  const { user } = useUser();
  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await fetch(
          `/api/service-provider/${user?.id}/service`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Service not found");
        }
        const data = await response.json();
        setService(data);
      } catch (error) {
        console.error(error);
        setService(undefined);
      }
    };

    fetchService();
  }, [user?.id]);

  return (
    <div className="container mx-auto p-4">
      {!service && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex justify-center items-center">
          <div className="p-5 bg-white border border-grey-500 rounded-lg">
            <h2 className="font-bold text-lg mb-4">
              You need to create a service!
            </h2>
            <button
              className="bg-purple-blue-500 hover:bg-purple-blue-600 text-white font-bold py-2 px-4 rounded"
              onClick={() => console.log("Navigate to service creation page")}
            >
              Create Service
            </button>
          </div>
        </div>
      )}
      {service && (
        <div>
          <h1>{service.name}</h1>
          <p>{service.description}</p>
        </div>
      )}
    </div>
  );
};

export default ServiceProviderDashboard;
