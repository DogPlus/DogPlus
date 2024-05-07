import React, { useState, useEffect } from 'react';
import { Service } from '../types/services';

type ServiceProviderFilterProps = {
    services: Service[];
    onFilterChange: (selectedServices: Service[]) => void;
};

const ServiceProviderFilter: React.FC<ServiceProviderFilterProps> = ({
    services,
    onFilterChange,
}) => {
    const [selectedServices, setSelectedServices] = useState<Service[]>([]);

    useEffect(() => {
        onFilterChange(selectedServices);
    }, [selectedServices]);

    const handleServiceClick = (serviceId: number) => {
        const isSelected = selectedServices.some(s => s.id === serviceId);
        if (isSelected) {
            setSelectedServices(selectedServices.filter(s => s.id !== serviceId));
        } else {
            const selectedService = services.find(service => service.id === serviceId);
            if (selectedService) {
                setSelectedServices([...selectedServices, selectedService]);
            }
        }
    };

    return (
        <div>
            <h2>Service Provider Filter</h2>
            <div>
                {services.map(service => (
                    <button
                        key={service.id}
                        onClick={() => handleServiceClick(service.id)}
                        style={{
                            backgroundColor: selectedServices.some(s => s.id === service.id) ? 'blue' : 'gray',
                            color: 'white',
                            padding: '8px',
                            margin: '4px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                        }}
                    >
                        {service.name}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ServiceProviderFilter;
