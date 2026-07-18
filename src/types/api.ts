import type { Vehicle } from "@/types/vehicle";

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export interface ApiError {
  success: false;
  error: string;
  statusCode: number;
}

export interface VehiclesApiResponse extends ApiResponse<Vehicle[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface VehicleApiResponse extends ApiResponse<Vehicle> {}
