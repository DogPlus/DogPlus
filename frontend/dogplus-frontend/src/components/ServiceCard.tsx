import react from 'react';
import { Service } from '../types/services';

interface ServiceCardProps {
  serviceProviderService: Service;
  onClick: () => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({serviceProviderService: serviceProviderService, onClick: onClick }) => {
  return (

    <div 
      className="bg-white rounded-lg shadow-md border p-4 sm:mx-auto md:max-w-lg lg:max-w-xl" 
      onClick={onClick}
      >
      
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
  );
}
