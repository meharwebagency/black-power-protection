import { getServiceClient } from "@/lib/supabase/server";

const BUCKET_NAME = "vehicle-images";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/webp", "image/avif", "image/jpeg", "image/png"];
const MAX_DIMENSION = 2400;

interface UploadResult {
  path: string;
  url: string;
  width: number;
  height: number;
  file_size: number;
}

interface UploadOptions {
  vehicleId: string;
  fileName: string;
  fileBuffer: Buffer;
  contentType: string;
}

export async function uploadVehicleImage(
  options: UploadOptions
): Promise<UploadResult> {
  const { vehicleId, fileName, fileBuffer, contentType } = options;

  if (fileBuffer.byteLength > MAX_FILE_SIZE) {
    throw new Error(`File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`);
  }

  if (!ALLOWED_TYPES.includes(contentType)) {
    throw new Error(
      `Invalid file type. Allowed: ${ALLOWED_TYPES.join(", ")}`
    );
  }

  const supabase = await getServiceClient();
  const filePath = `${vehicleId}/${fileName}`;

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, fileBuffer, {
      contentType,
      upsert: true,
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);

  return {
    path: filePath,
    url: publicUrl,
    width: 0, // Will be set by sharp in the processing pipeline
    height: 0,
    file_size: fileBuffer.byteLength,
  };
}

export async function deleteVehicleImage(path: string): Promise<void> {
  const supabase = await getServiceClient();

  const { error } = await supabase.storage.from(BUCKET_NAME).remove([path]);

  if (error) {
    throw new Error(`Delete failed: ${error.message}`);
  }
}

export async function deleteVehicleFolder(
  vehicleId: string
): Promise<void> {
  const supabase = await getServiceClient();

  const { data: files, error: listError } = await supabase.storage
    .from(BUCKET_NAME)
    .list(vehicleId);

  if (listError) {
    throw new Error(`List failed: ${listError.message}`);
  }

  if (files && files.length > 0) {
    const paths = files.map((f) => `${vehicleId}/${f.name}`);
    const { error } = await supabase.storage.from(BUCKET_NAME).remove(paths);
    if (error) {
      throw new Error(`Delete folder failed: ${error.message}`);
    }
  }
}

export function getVehicleImageUrl(
  vehicleId: string,
  fileName: string
): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return `${supabaseUrl}/storage/v1/object/public/${BUCKET_NAME}/${vehicleId}/${fileName}`;
}

export { BUCKET_NAME, MAX_FILE_SIZE, ALLOWED_TYPES, MAX_DIMENSION };
