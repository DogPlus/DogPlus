// src/components/ServiceProviderList.tsx

import React, { useState, useEffect } from 'react';
import ProviderCard from './ServiceProviderCard';  // Make sure to import the ProviderCard
import { ServiceProvider } from '../types/serviceProvider';
import { useNavigate } from 'react-router-dom';

interface ServiceProviderListProps {
    serviceProviders: ServiceProvider[];  // Define the type for the incoming prop
}

const ServiceProviderList: React.FC<ServiceProviderListProps> = ({serviceProviders}) => {
    const navigate = useNavigate();

    return (
        <div>
            <ul>
                {serviceProviders.map((serviceProvider) => (
                    <li key={serviceProvider.id} onClick={(e)=>{navigate(`/serviceproviders/${serviceProvider.id}`)}}>
                        <ProviderCard serviceProvider={serviceProvider} />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ServiceProviderList;
