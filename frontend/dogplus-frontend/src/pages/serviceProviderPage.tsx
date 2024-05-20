import React, { useState, useEffect } from 'react';
import ServiceProviderList from "../components/ServiceProviderList";
import ServiceProviderSearch from "../components/ServiceProviderSearch";
import { ServiceProvider } from '../types/serviceProvider';
import ServiceProviderFilter from '../components/ServiceProviderFilter';
import { Service } from '../types/services';
import { useNavigate } from 'react-router-dom';

export const ServiceProviderPage = () => {
    const [serviceProviders, setServiceProviders] = useState<ServiceProvider[]>([]);
    const [displayedServiceProviders, setDisplayedServiceProviders] = useState<ServiceProvider[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [selectedServices, setSelectedServices] = useState<Service[]>([]);

    const navigate = useNavigate();

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
            filterProviders();
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

    const filterProviders = (): void => {
        if (selectedServices.length === 0) {
            setDisplayedServiceProviders(serviceProviders);
        } else {
            const selectedProviderIds = selectedServices.map(service => service.service_provider);
            const filteredProviders = serviceProviders.filter(provider => 
                selectedProviderIds.includes(provider.id));
            setDisplayedServiceProviders(filteredProviders);
        }
    };

    useEffect(() => {
        filterProviders();
    }, [selectedServices, serviceProviders]);

    const handleSearchResults = (results: ServiceProvider[]): void => {
        setServiceProviders(results);
        filterProviders();
    };

    const handleFilterChange = (selectedServices: Service[]): void => {
        setSelectedServices(selectedServices);
        filterProviders();
    };

    return (
        <div>

            <div className="flex justify-center items-center p-2">
              <button 
                onClick={() => navigate("/map")}
                className='flex justify-center items-center w-4/5 p-2 rounded-md font-bold text-white cursor-pointer bg-accent-0'>
                  <i className="fas fa-map-marker-alt mr-2"></i>
                  Search on map
              </button>
            </div>
            <ServiceProviderSearch onSearchResults={handleSearchResults} />
            <ServiceProviderFilter services={services} onFilterChange={handleFilterChange} />
            <ServiceProviderList serviceProviders={displayedServiceProviders} />
        </div>
    );
};
