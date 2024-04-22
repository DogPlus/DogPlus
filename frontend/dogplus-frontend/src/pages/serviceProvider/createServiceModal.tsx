import React, { ChangeEvent, useState } from "react";
import {
  PriceType,
  ServiceCreationData,
  ServiceType,
} from "../../types/service";

interface CreateServiceModalProps {
  isOpen: boolean;
  serviceProviderId: string; // Ensure serviceProviderId is always provided
  onClose: () => void;
  onSave: (serviceData: ServiceCreationData) => Promise<void>;
}

const CreateServiceModal = ({
  isOpen,
  serviceProviderId,
  onClose,
  onSave,
}: CreateServiceModalProps) => {
  const [name, setName] = useState<ServiceType | undefined>();
  const [description, setDescription] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [priceType, setPriceType] = useState<PriceType | undefined>();
  const [price, setPrice] = useState<number>(0);
  const [sessionTime, setSessionTime] = useState<number>(0);

  const handleNameChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as ServiceType;
    setName(value);
    setPriceType(
      value === ServiceType.DogTraining || value === ServiceType.DogDaycare
        ? PriceType.PerSession
        : PriceType.Fixed
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      !name ||
      !priceType ||
      (priceType === PriceType.Fixed && price <= 0) ||
      (priceType === PriceType.PerSession && (price <= 0 || sessionTime <= 0))
    ) {
      alert("Please fill all required fields with valid values.");
      return;
    }

    let serviceData: ServiceCreationData;

    if (priceType === PriceType.Fixed) {
      if (price !== undefined) {
        serviceData = {
          name,
          description,
          location,
          serviceProviderId,
          fixedPrice: price,
        };
      } else {
        throw new Error("Fixed price must be set");
      }
    } else if (priceType === PriceType.PerSession) {
      if (price !== undefined && sessionTime !== undefined) {
        serviceData = {
          name,
          description,
          location,
          serviceProviderId,
          pricePerSession: price,
          sessionTime,
        };
      } else {
        throw new Error("Both price per session and session time must be set");
      }
    } else {
      throw new Error("Invalid price type");
    }

    await onSave(serviceData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <form onSubmit={handleSubmit}>
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Create Service
          </h3>
          <select
            value={name || ""}
            onChange={handleNameChange}
            className="mb-2 w-full px-3 py-2 border rounded"
            required
          >
            <option value="">Select Service Type</option>
            {Object.values(ServiceType).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="mb-2 w-full px-3 py-2 border rounded"
            required
          />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
            className="mb-2 w-full px-3 py-2 border rounded"
            required
          />
          {priceType && (
            <>
              <input
                type="number"
                value={price || ""}
                onChange={(e) => setPrice(parseFloat(e.target.value))}
                placeholder={
                  priceType === PriceType.Fixed
                    ? "Fixed Price"
                    : "Price Per Session"
                }
                className="mb-2 w-full px-3 py-2 border rounded"
                required
              />
              {priceType === PriceType.PerSession && (
                <input
                  type="number"
                  value={sessionTime || ""}
                  onChange={(e) => setSessionTime(parseInt(e.target.value, 10))}
                  placeholder="Session Time (minutes)"
                  className="mb-2 w-full px-3 py-2 border rounded"
                  required
                />
              )}
            </>
          )}
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Create Service
          </button>
        </form>
        <button
          onClick={onClose}
          className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default CreateServiceModal;
