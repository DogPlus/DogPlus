import react, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Loading } from '../components/common/loading';
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
              console.log(error);
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
              console.log(error);
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
                    <div className={`flex flex-row gap-4 bg-blue-100 text-blue-800 text-md font-medium me-2 px-2.5 py-0.5 rounded-full`}>
                      <div className="fa-suitcase"/>
                      Type
                    </div>
                  </div>
              </div>
          </div>
          <p className="text-gray-700 mb-4">
            This part should contain the provider's bio, but we don't have that information yet.
          </p>
          <h3 className="text-lg font-semibold mb-2">Provided service(s)</h3>

          {serviceProviderService ? (
                  <div 
                    className="bg-white rounded-lg shadow-md border p-4 sm:mx-auto md:max-w-lg lg:max-w-xl" 
                    onClick={(e) => navigate(`/serviceproviders/services/${serviceProviderService.id}/booking`)}>
                    
                    <div className="mb-2">
                      <h3 className="text-md font-semibold">{serviceProviderService.name}</h3>
                      <p className="text-gray-600">{serviceProviderService.description}</p>
                    </div>
                    <div className="flex flex-row">
                        
                        <div className="flex flex-col gap-2">
                          <div className={`flex flex-row gap-4 bg-yellow-100 text-yellow-800 text-md font-medium me-2 px-2.5 py-0.5 rounded-full`}>
                            <div className="fa-clock"/>
                            {serviceProviderService.session_time} minutes
                          </div>
                          <div className={`flex flex-row gap-4 bg-yellow-100 text-yellow-800 text-md font-medium me-2 px-2.5 py-0.5 rounded-full`}>
                            <div className="fa-tag"/>
                            {serviceProviderService.fixed_price && (
                              <p>Fixed: {serviceProviderService.fixed_price} €</p>
                            )}
                            {serviceProviderService.price_per_session && (
                              <p>Per session: {serviceProviderService.price_per_session} €</p>
                            )}
                          </div>
                          <div className={`flex flex-row gap-4 bg-yellow-100 text-yellow-800 text-md font-medium me-2 px-2.5 py-0.5 rounded-full`}>
                            <div className="fa-map-marker"/>
                            {serviceProviderService.location} 
                          </div>
                        </div>
                      <div className="ml-auto fa-arrow-right"/>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p>This provider has not added any services yet.</p>
                  </div>
                )}
        
        </div>
  );
};
