export enum ServiceType {
  DogTraining = "Dog Training",
  VeterinaryServices = "Veterinary Services",
  DogDaycare = "Dog Daycare",
  DogInsurance = "Dog Insurance",
}

export enum PriceType {
  Fixed = "Fixed",
  PerSession = "Per Session",
}

interface BaseService {
  id: string;
  name: ServiceType;
  description: string;
  location: string;
  serviceProviderId: string;
}

interface FixedPriceService extends BaseService {
  priceType: PriceType.Fixed;
  fixedPrice: number;
}

interface PerSessionPriceService extends BaseService {
  priceType: PriceType.PerSession;
  pricePerSession: number;
  sessionTime: number;
}

export type ServiceData = FixedPriceService | PerSessionPriceService;
