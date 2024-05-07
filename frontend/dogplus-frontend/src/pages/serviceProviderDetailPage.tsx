import react, { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { Loading } from '../components/common/loading';
import { Label } from '../components/label';
import { ServiceCard } from '../components/ServiceCard';
import { ServiceProvider } from '../types/serviceProvider';
import { Service } from '../types/services';

export const ServiceProviderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [serviceProvider, setServiceProvider] = react.useState<ServiceProvider>();
  const [serviceProviderService, setServiceProviderService] = react.useState<Service>();


  useEffect(() => {
      const fetchData = async () => {
          try {
              const response = await fetch(`${process.env.REACT_APP_BACKEND_HOST}/api/providers/service-providers/${id}`,{ //TODO change to an endpoint using a user specific algorithm
                  method: "GET",
                  headers: {
                    "Authorization": "Token "+ localStorage.getItem("token")
                  },
                });

              if (!response.ok) {
                  throw new Error('Network response was not ok');
              }
              const data: ServiceProvider = await response.json();
              setServiceProvider(data);
          } catch (error) {
              console.error(error);
              toast.error("Failed to fetch service provider");
          }
      };

      fetchData();
  }, [id]);

  useEffect(() => {
      const fetchData = async () => {
          try {
              const response = await fetch(`${process.env.REACT_APP_BACKEND_HOST}/api/services/service/service_provider/${id}`,{ //TODO change to an endpoint using a user specific algorithm
                  method: "GET",
                  headers: {
                    "Authorization": "Token "+ localStorage.getItem("token")
                  },
                });

              if (!response.ok) {
                  throw new Error('Network response was not ok');
              }
              const data: Service = await response.json();
              setServiceProviderService(data);
          } catch (error) {
              console.error(error);
              toast.error("Failed to fetch service provider service");
          }
      };

      fetchData();
    }, [id]);

  if(!serviceProvider) {
    return <Loading />;
  }

  return (
        <div className="m-4">
          <div className="flex items-center mb-4">
              <img className="w-12 h-12 rounded-full mr-3" src={serviceProvider.profile_image} alt="Profile Image" />
              <div>
                  <h2 className="text-lg font-semibold">{serviceProvider.username}</h2>
                  <div className="flex flex-row">
                    <Label icon="fa-suitcase" color="blue" text="Type"/>
                  </div>
              </div>
          </div>
          <p className="text-gray-700 mb-4">
            This part should contain the provider's bio, but we don't have that information yet.
          </p>
          <h3 className="text-lg font-semibold mb-2">Provided service(s)</h3>

          {serviceProviderService ? (
                    <ServiceCard serviceProviderService={serviceProviderService} onClick={() => navigate(`/serviceproviders/services/${serviceProviderService.id}/booking`)}/>
                ) : (
                  <div>
                    <p>This provider has not added any services yet.</p>
                  </div>
                )}
        
        </div>
  );
};
