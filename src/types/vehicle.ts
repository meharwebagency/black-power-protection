export type VehicleStatus = "available" | "sold" | "reserved" | "pending";
export type FuelType = "gasoline" | "diesel" | "electric" | "hybrid";
export type Transmission = "automatic" | "manual";
export type BodyType = "sedan" | "suv" | "coupe" | "convertible" | "hatchback" | "truck" | "van" | "wagon";
export type VehicleCondition = "new" | "used";

export interface VehicleImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface Vehicle {
  id: string;
  slug: string;
  make: string;
  makeAr: string;
  model: string;
  modelAr: string;
  year: number;
  price: number;
  currency: string;
  mileage: number;
  fuelType: FuelType;
  fuelTypeAr: string;
  transmission: Transmission;
  transmissionAr: string;
  bodyType: BodyType;
  bodyTypeAr: string;
  engineSize: string;
  horsepower: number;
  condition: VehicleCondition;
  color: string;
  colorAr: string;
  interiorColor: string;
  interiorColorAr: string;
  description: string;
  descriptionAr: string;
  status: VehicleStatus;
  featured?: boolean;
  location?: string;
  locationAr?: string;
  images: VehicleImage[];
  features: string[];
  featuresAr: string[];
  vin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleFilter {
  make?: string;
  model?: string;
  yearFrom?: number;
  yearTo?: number;
  priceFrom?: number;
  priceTo?: number;
  mileageFrom?: number;
  mileageTo?: number;
  fuelType?: FuelType;
  transmission?: Transmission;
  bodyType?: BodyType;
  color?: string;
  status?: VehicleStatus;
  condition?: VehicleCondition;
  search?: string;
}

export interface VehicleSort {
  field: "price" | "year" | "mileage" | "createdAt";
  direction: "asc" | "desc";
}
