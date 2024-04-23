import { ServiceType } from "../types/service";

export function mapStringToServiceType(value: string): ServiceType | undefined {
  switch (value) {
    case ServiceType.DogTraining:
      return ServiceType.DogTraining;
    case ServiceType.VeterinaryServices:
      return ServiceType.VeterinaryServices;
    case ServiceType.DogDaycare:
      return ServiceType.DogDaycare;
    case ServiceType.DogInsurance:
      return ServiceType.DogInsurance;
    default:
      return undefined;
  }
}
