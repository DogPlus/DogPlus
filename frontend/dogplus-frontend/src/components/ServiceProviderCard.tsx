import React from 'react';
import { ServiceProvider } from "../types/serviceProvider";
interface ServiceProviderCardProps {
    serviceProvider: ServiceProvider;
}


const ServiceProviderCard: React.FC<ServiceProviderCardProps> = ({ serviceProvider: serviceProvider }) => {
    return (
        <div className="bg-white rounded-lg shadow-md border p-4 mt-4 mx-1 sm:mx-auto md:max-w-lg lg:max-w-xl">
          <div className="flex items-center">
              <img className="w-12 h-12 rounded-full mr-3" src={serviceProvider.profile_image} alt="Profile Image" />
              <div>
                  <h2 className="text-lg font-semibold">{serviceProvider.username}</h2>
                  <div className="flex flex-row">
                    <div className={`flex flex-row gap-4 bg-blue-100 text-blue-800 text-md font-medium me-2 px-2.5 py-0.5 rounded-full`}>
                      <div className="fa-suitcase"/>
                      Type
                    </div>
                    <div className={`flex flex-row gap-4 bg-green-100 text-green-800 text-md font-medium me-2 px-2.5 py-0.5 rounded-full`}>
                      <div className="fa-clock"/>
                      Duration
                    </div>
                    <div className={`flex flex-row gap-4 bg-yellow-100 text-yellow-800 text-md font-medium me-2 px-2.5 py-0.5 rounded-full`}>
                      <div className="fa-tag"/>
                      Price
                    </div>
                  </div>
              </div>
              <div className="fa-arrow-right"/>
          </div>
        </div>
    );
};
  
export default ServiceProviderCard;
