import React, { useState, useEffect } from 'react';
import ServiceProviderList from "../components/ServiceProviderList";
import ServiceProviderSearch from "../components/ServiceProviderSearch";
import { ServiceProvider } from '../types/serviceProvider';
import ServiceProviderFilter from '../components/ServiceProviderFilter';
import { Service } from '../types/services';

export const ServiceProviderPage = () => {
    const [serviceProviders, setServiceProviders] = useState<ServiceProvider[]>([]);
    const [displayedServiceProviders, setDisplayedServiceProviders] = useState<ServiceProvider[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [selectedServices, setSelectedServices] = useState<Service[]>([]);

    useEffect(() => {
        const fetchProviders = async () => {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_HOST}/api/providers/service-providers/list/`, {
                method: "GET",
                headers: {
                    "Authorization": "Token " + localStorage.getItem("token")
                },
            });
            const data: ServiceProvider[] = await response.json();
            setServiceProviders(data);
            setDisplayedServiceProviders(data);
        };

        const fetchServices = async () => {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_HOST}/api/services/list/`, {
                method: "GET",
                headers: {
                    "Authorization": "Token " + localStorage.getItem("token")
                },
            });
            const data: Service[] = await response.json();
            setServices(data);
        };

        fetchProviders();
        fetchServices();
    }, []);

    useEffect(() => {
        if (selectedServices.length === 0) {
            setDisplayedServiceProviders(serviceProviders);
        } else {
            const selectedProviderIds = selectedServices.map(service => service.service_provider);
            const filteredProviders = serviceProviders.filter(provider => 
                selectedProviderIds.includes(provider.id));
            setDisplayedServiceProviders(filteredProviders);
        }
    }, [selectedServices, serviceProviders]);

    const handleFilterChange = (selectedServices: Service[]) => {
        setSelectedServices(selectedServices);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold underline">Service Providers</h1>
            <ServiceProviderSearch onSearchResults={setDisplayedServiceProviders} />
            <ServiceProviderFilter services={services} onFilterChange={handleFilterChange} />
            <ServiceProviderList serviceProviders={displayedServiceProviders} />
        </div>
    );
};
