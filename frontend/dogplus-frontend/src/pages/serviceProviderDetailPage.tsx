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
        <div className="bg-white rounded-lg shadow-md border p-4 mt-4 sm:mx-auto md:max-w-lg lg:max-w-xl">
          <div className="flex items-center mb-4">
              {/* <img className="w-12 h-12 rounded-full mr-3" src={provider.profile_pic} alt="Profile Image" /> //TODO: Add profile pic */} 
              <div>
                  <h2 className="text-lg font-semibold">{serviceProvider.username}</h2>
                  <p className="text-gray-500 text-sm">Contact: {serviceProvider.email}</p>
              </div>
          </div>
          <p className="text-gray-700 mb-4">
            This part should contain the provider's bio, but we don't have that information yet.
          </p>

          {serviceProviderService ? (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Provided service</h3>
                    <div className="mb-2">
                      <h3 className="text-md font-semibold">{serviceProviderService.name}</h3>
                      <p className="text-gray-600">{serviceProviderService.description}</p>
                    </div>
                    <div className="mb-2">
                      <p><span className="font-semibold">Duration:</span> {serviceProviderService.session_time} minutes</p>
                      {serviceProviderService.fixed_price && (
                        <p><span className="font-semibold">Fixed price:</span> {serviceProviderService.fixed_price}</p>
                      )}
                      {serviceProviderService.price_per_session && (
                        <p><span className="font-semibold">Price per session:</span> {serviceProviderService.price_per_session}</p>
                      )}
                      <p><span className="font-semibold">Location:</span> {serviceProviderService.location}</p>
                    </div>
                    <button 
                      type="button" 
                      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                      onClick={() => navigate(`/serviceproviders/services/${serviceProviderService.id}/booking`)}
                    >
                      Book/Order
                    </button>
                  </div>
                ) : (
                  <div>
                    <p>This provider has not added any services yet.</p>
                  </div>
                )}
        
        </div>
  );
};
