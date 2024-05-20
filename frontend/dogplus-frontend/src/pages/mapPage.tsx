import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import ProviderCard from '../components/ServiceProviderCard';  // Make sure to import the ProviderCard
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Service } from '../types/services';
import { ServiceProvider } from '../types/serviceProvider';
import { useNavigate } from 'react-router-dom';

// Fix for missing marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Position {
  lat: number;
  lng: number;
  service_provider: ServiceProvider;
}


const getRandomCoordinate = (min: number, max: number) => Math.random() * (max - min) + min;

const MapPage: React.FC = () => {
    const [serviceProviders, setServiceProviders] = useState<ServiceProvider[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [markers, setMarkers] = useState<Position[]>([]);


  const navigate = useNavigate();

  const handleMarkerClick = (position: Position) => {
  };


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
    let temp = [];
    for (const serviceProvider of serviceProviders) {
      temp.push({
        lat: getRandomCoordinate(45.4415, 45.5119), // Approximate latitude range for Milan
        lng: getRandomCoordinate(9.1765, 9.2200),  // Approximate longitude range for Milan
        service_provider: serviceProvider,
      });
    }
    setMarkers(temp);
  }, [serviceProviders, services]);

  return (
    <MapContainer center={[45.464211, 9.191383]} zoom={13} style={{ height: "100vh", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {markers.map((marker, index) => (
        <Marker
          key={index}
          position={[marker.lat, marker.lng]}
          eventHandlers={{
            click: () => handleMarkerClick(marker),
          }}
        >
        <Popup>
          <div onClick={(e) => {navigate(`/serviceproviders/${marker.service_provider.id}`)}}>
          <ProviderCard serviceProvider={marker.service_provider}/>
          </div>
        </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapPage;
