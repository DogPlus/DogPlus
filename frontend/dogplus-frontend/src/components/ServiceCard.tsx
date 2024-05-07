import react from 'react';
import { Service } from '../types/services';
import { Label } from './label';

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
            <Label icon="fa-clock" color="yellow" text={`${serviceProviderService.session_time} minutes`}/>
            <Label icon="fa-tag" color="yellow" text={serviceProviderService.fixed_price ? `Fixed: ${serviceProviderService.fixed_price} €` : `Per Session: ${serviceProviderService.price_per_session} €`}/>
            <Label icon="fa-map-marker" color="yellow" text={serviceProviderService.location}/>
          </div>
          <div className="ml-auto fas fa-arrow-right"/>
      </div>
    </div>
  );
}
