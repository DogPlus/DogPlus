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

export interface BaseService<T extends PriceType> {
  id: string;
  name: ServiceType;
  description: string;
  location: string;
  serviceProviderId: string;
  priceType: T;
}

export interface FixedPriceService extends BaseService<PriceType.Fixed> {
  fixedPrice: number;
}

export interface PerSessionPriceService
  extends BaseService<PriceType.PerSession> {
  pricePerSession: number;
  sessionTime: number;
}

export interface BaseServiceCreation<T extends PriceType> {
  name: ServiceType;
  description: string;
  location: string;
  serviceProviderId: string;
  priceType: T;
}

export interface FixedPriceServiceCreation
  extends BaseServiceCreation<PriceType.Fixed> {
  fixedPrice: number;
}

export interface PerSessionPriceServiceCreation
  extends BaseServiceCreation<PriceType.PerSession> {
  pricePerSession: number;
  sessionTime: number;
}

export type ServiceData = FixedPriceService | PerSessionPriceService;

export type ServiceCreationData =
  | FixedPriceServiceCreation
  | PerSessionPriceServiceCreation;
