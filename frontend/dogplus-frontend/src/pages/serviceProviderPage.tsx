import React, { useState, useEffect } from 'react';
import ServiceProviderList from "../components/ServiceProviderList";
import ServiceProviderSearch from "../components/ServiceProviderSearch";
import { ServiceProvider } from '../types/serviceProvider';


export const ServiceProviderPage = () => {
  const [serviceProviders, setServiceProviders] = useState<ServiceProvider[]>([]);

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
      <h1 className="text-3xl font-bold underline">Service Providers</h1>
      <ServiceProviderSearch onSearchResults={setServiceProviders} />
      <ServiceProviderList serviceProviders={serviceProviders} />
    </div>
  );
};