import React from 'react';
import { ServiceProvider } from "../types/serviceProvider";

interface ServiceProviderCardProps {
    serviceProvider: ServiceProvider;
}


const ServiceProviderCard: React.FC<ServiceProviderCardProps> = ({ serviceProvider: serviceProvider }) => {
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
  
        </div>
    );
};
  
export default ServiceProviderCard;