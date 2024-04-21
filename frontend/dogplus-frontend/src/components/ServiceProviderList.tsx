// src/components/ServiceProviderList.tsx

import React, { useState, useEffect } from 'react';
import ProviderCard from './ServiceProviderCard';  // Make sure to import the ProviderCard
import { ServiceProvider } from '../types/serviceProvider';
import { useNavigate } from 'react-router-dom';

const ServiceProviderList: React.FC = () => {
    const [serviceProviders, setServiceProviders] = useState<ServiceProvider[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_HOST}/api/providers/service-providers/list/`,{ //TODO change to an endpoint using a user specific algorithm
                    method: "GET",
                    headers: {
                      "Authorization": "Token "+ localStorage.getItem("token")
                    },
                  });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data: ServiceProvider[] = await response.json();
                setServiceProviders(data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, []);

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
