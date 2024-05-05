import React from 'react';
import { ServiceProvider } from "../types/serviceProvider";
import { Label } from './label';
interface ServiceProviderCardProps {
    serviceProvider: ServiceProvider;
}


const ServiceProviderCard: React.FC<ServiceProviderCardProps> = ({ serviceProvider: serviceProvider }) => {
    return (
        <div className="bg-white rounded-lg shadow-md border p-4 mt-4 mx-1 sm:mx-auto md:max-w-lg lg:max-w-xl">
          <div className="flex items-center">
              <img className="w-12 h-12 rounded-full mr-3 object-cover" src={serviceProvider.profile_image} alt="Profile Image" />
              <div>
                  <h2 className="text-lg font-semibold">{serviceProvider.username}</h2>
                  <div className="flex flex-row">
                    <Label icon="fa-suitcase" color="blue" text="Type"/>
                  </div>
              </div>
              <div className="ml-auto fas fa-arrow-right"/>
          </div>
        </div>
    );
};
  
export default ServiceProviderCard;
