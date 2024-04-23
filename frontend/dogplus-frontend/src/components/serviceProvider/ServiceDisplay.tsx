import React from "react";
import {
  ServiceData,
  FixedPriceService,
  PerSessionPriceService,
} from "../../types/service";

interface ServiceDisplayProps {
  service: ServiceData;
}

const ServiceDisplay: React.FC<ServiceDisplayProps> = ({ service }) => {
  const isFixedPrice = "fixedPrice" in service;

  return (
    <div className="p-4 rounded-lg shadow bg-white">
      <h2 className="text-xl font-bold text-dark-grey-900 mb-2">
        {service.name}
      </h2>
      <p className="text-grey-600">{service.description}</p>
      <div className="mt-4">
        <span className="text-lg font-semibold text-dark-grey-900">
          Price:{" "}
        </span>
        {isFixedPrice ? (
          <span className="text-purple-blue-500">
            ${(service as FixedPriceService).fixedPrice.toFixed(2)}
          </span>
        ) : (
          <span className="text-purple-blue-500">
            €{(service as PerSessionPriceService).pricePerSession.toFixed(2)}{" "}
            per session
          </span>
        )}
      </div>
      {!isFixedPrice && (
        <p className="text-grey-600">
          Session Time: {(service as PerSessionPriceService).sessionTime}{" "}
          minutes
        </p>
      )}
    </div>
  );
};

export default ServiceDisplay;
