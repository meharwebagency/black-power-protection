import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { mapVehicleRow, mapVehicleRows } from "@/lib/mappers/vehicle";
import type { VehicleFilter, VehicleSort } from "@/types/vehicle";
import { PAGINATION } from "@/lib/constants";

interface VehiclesRequestParams {
  searchParams: URLSearchParams;
}

function parseFilters(searchParams: URLSearchParams): VehicleFilter {
  return {
    make: searchParams.get("make") || undefined,
    model: searchParams.get("model") || undefined,
    yearFrom: searchParams.get("yearFrom") ? Number(searchParams.get("yearFrom")) : undefined,
    yearTo: searchParams.get("yearTo") ? Number(searchParams.get("yearTo")) : undefined,
    priceFrom: searchParams.get("priceFrom") ? Number(searchParams.get("priceFrom")) : undefined,
    priceTo: searchParams.get("priceTo") ? Number(searchParams.get("priceTo")) : undefined,
    fuelType: (searchParams.get("fuelType") as VehicleFilter["fuelType"]) || undefined,
    transmission: (searchParams.get("transmission") as VehicleFilter["transmission"]) || undefined,
    bodyType: (searchParams.get("bodyType") as VehicleFilter["bodyType"]) || undefined,
    status: (searchParams.get("status") as VehicleFilter["status"]) || undefined,
    search: searchParams.get("search") || undefined,
  };
}

function parseSort(searchParams: URLSearchParams): VehicleSort {
  const field = (searchParams.get("sortField") as VehicleSort["field"]) || "createdAt";
  const direction = (searchParams.get("sortDirection") as VehicleSort["direction"]) || "desc";
  return { field, direction };
}

function parsePagination(searchParams: URLSearchParams) {
  const page = Math.max(1, Number(searchParams.get("page")) || PAGINATION.DEFAULT_PAGE);
  const limit = Math.min(
    PAGINATION.MAX_LIMIT,
    Math.max(1, Number(searchParams.get("limit")) || PAGINATION.DEFAULT_LIMIT)
  );
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  return { page, limit, from, to };
}

export async function getVehicles({ searchParams }: VehiclesRequestParams) {
  const supabase = await createClient();
  const filters = parseFilters(searchParams);
  const sort = parseSort(searchParams);
  const { page, limit, from, to } = parsePagination(searchParams);

  let query = supabase
    .from("vehicles")
    .select("*, vehicle_images(*)", { count: "exact" })
    .is("deleted_at", null);

  // Public listing only exposes a specific status when explicitly requested;
  // otherwise it defaults to available. Drafts are never a valid public filter
  // value (see VehicleStatus), so they can never be requested here.
  if (filters.status) {
    query = query.eq("status", filters.status);
  } else {
    query = query.eq("status", "available");
  }

  // Apply filters
  if (filters.make) query = query.eq("make", filters.make);
  if (filters.model) query = query.eq("model", filters.model);
  if (filters.yearFrom) query = query.gte("year", filters.yearFrom);
  if (filters.yearTo) query = query.lte("year", filters.yearTo);
  if (filters.priceFrom) query = query.gte("price", filters.priceFrom);
  if (filters.priceTo) query = query.lte("price", filters.priceTo);
  if (filters.fuelType) query = query.eq("fuel_type", filters.fuelType);
  if (filters.transmission) query = query.eq("transmission", filters.transmission);
  if (filters.bodyType) query = query.eq("body_type", filters.bodyType);
  if (filters.search) {
    query = query.or(
      `make.ilike.%${filters.search}%,model.ilike.%${filters.search}%,make_ar.ilike.%${filters.search}%,model_ar.ilike.%${filters.search}%`
    );
  }

  // Apply sort
  const sortColumn = sort.field === "createdAt" ? "created_at" : sort.field;
  query = query.order(sortColumn, { ascending: sort.direction === "asc" });

  // Apply pagination
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return {
    data: mapVehicleRows(data),
    pagination: {
      page,
      limit,
      total: count || 0,
    },
  };
}

export async function getVehicleBySlug(slug: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("vehicles")
    .select("*, vehicle_images(*)")
    .eq("slug", slug)
    .is("deleted_at", null)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapVehicleRow(data);
}
