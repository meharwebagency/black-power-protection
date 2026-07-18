import type {
  Vehicle,
  VehicleImage,
  FuelType,
  Transmission,
  BodyType,
  VehicleStatus,
} from "@/types/vehicle";

// Raw vehicle row as returned by Supabase (snake_case) with joined images.
interface RawVehicleImage {
  id: string;
  url: string;
  alt: string | null;
  is_primary: boolean;
  sort_order: number;
}

interface RawVehicle {
  id: string;
  slug: string;
  make: string;
  make_ar: string;
  model: string;
  model_ar: string;
  year: number;
  price: number;
  currency: string;
  mileage: number;
  fuel_type: string;
  fuel_type_ar: string;
  transmission: string;
  transmission_ar: string;
  body_type: string;
  body_type_ar: string;
  engine_size: string | null;
  horsepower: number | null;
  color: string;
  color_ar: string;
  interior_color: string | null;
  interior_color_ar: string | null;
  description: string;
  description_ar: string;
  status: string;
  is_featured: boolean;
  features: string[] | null;
  features_ar: string[] | null;
  vin: string | null;
  created_at: string;
  updated_at: string;
  vehicle_images?: RawVehicleImage[] | null;
}

function mapImages(rows: RawVehicleImage[] | null | undefined): VehicleImage[] {
  if (!rows || rows.length === 0) return [];
  return rows
    .slice()
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map((img) => ({
      id: img.id,
      url: img.url,
      alt: img.alt ?? "",
      isPrimary: img.is_primary,
      sortOrder: img.sort_order,
    }));
}

/**
 * Maps a raw Supabase vehicle row (snake_case, joined vehicle_images) into the
 * camelCase `Vehicle` shape the public UI components consume.
 */
export function mapVehicleRow(row: RawVehicle): Vehicle {
  return {
    id: row.id,
    slug: row.slug,
    make: row.make,
    makeAr: row.make_ar,
    model: row.model,
    modelAr: row.model_ar,
    year: row.year,
    price: row.price,
    currency: row.currency,
    mileage: row.mileage,
    fuelType: row.fuel_type as FuelType,
    fuelTypeAr: row.fuel_type_ar,
    transmission: row.transmission as Transmission,
    transmissionAr: row.transmission_ar,
    bodyType: row.body_type as BodyType,
    bodyTypeAr: row.body_type_ar,
    engineSize: row.engine_size ?? "",
    horsepower: row.horsepower ?? 0,
    color: row.color,
    colorAr: row.color_ar,
    interiorColor: row.interior_color ?? "",
    interiorColorAr: row.interior_color_ar ?? "",
    description: row.description,
    descriptionAr: row.description_ar,
    status: row.status as VehicleStatus,
    featured: row.is_featured,
    images: mapImages(row.vehicle_images),
    features: row.features ?? [],
    featuresAr: row.features_ar ?? [],
    vin: row.vin ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapVehicleRows(rows: RawVehicle[] | null | undefined): Vehicle[] {
  if (!rows) return [];
  return rows.map(mapVehicleRow);
}
