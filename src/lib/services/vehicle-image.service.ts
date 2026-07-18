import { getServiceClient } from "@/lib/supabase/server";
import {
  uploadVehicleImage,
  deleteVehicleImage,
  BUCKET_NAME,
} from "@/lib/storage/image-upload";
import { vehiclesCache, featuredCache } from "@/lib/cache";
import type { Database } from "@/types/database";

type VehicleImageRow = Database["public"]["Tables"]["vehicle_images"]["Row"];

interface IncomingImage {
  fileName: string;
  fileBuffer: Buffer;
  contentType: string;
}

export class VehicleImageService {
  static async uploadMany(
    vehicleId: string,
    files: IncomingImage[]
  ): Promise<VehicleImageRow[]> {
    if (files.length === 0) return [];

    const supabase = await getServiceClient();
    const rows: Database["public"]["Tables"]["vehicle_images"]["Insert"][] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const result = await uploadVehicleImage({
        vehicleId,
        fileName: file.fileName,
        fileBuffer: file.fileBuffer,
        contentType: file.contentType,
      });

      rows.push({
        vehicle_id: vehicleId,
        url: result.url,
        alt: "",
        is_primary: i === 0,
        sort_order: i,
      });
    }

    const { data, error } = await supabase
      .from("vehicle_images")
      .insert(rows)
      .select();

    if (error) throw new Error(error.message);

    vehiclesCache.clear();
    featuredCache.clear();

    return (data as VehicleImageRow[]) || [];
  }

  /**
   * Derive the storage object path ("<vehicleId>/<fileName>") from a public
   * image URL. vehicle_images stores only the URL, so the path we hand to
   * Storage.remove() has to be recovered from everything after the bucket name.
   * Returns null when the URL doesn't belong to our bucket.
   */
  private static storagePathFromUrl(url: string): string | null {
    const marker = `/${BUCKET_NAME}/`;
    const idx = url.indexOf(marker);
    if (idx === -1) return null;
    const path = url.slice(idx + marker.length).split("?")[0];
    return path ? decodeURIComponent(path) : null;
  }

  /**
   * Delete a single image, keeping Storage and the DB in sync: remove the
   * object from Storage first, then delete the row. If Storage removal fails
   * we abort and keep the row so the UI reflects reality (no orphaned record
   * pointing at a file that may still exist).
   */
  static async deleteOne(imageId: string): Promise<void> {
    const supabase = await getServiceClient();

    const { data: image, error: fetchError } = await supabase
      .from("vehicle_images")
      .select("id, url")
      .eq("id", imageId)
      .maybeSingle();

    if (fetchError) throw new Error(fetchError.message);
    if (!image) throw new Error("Image not found");

    const path = this.storagePathFromUrl(image.url);
    if (path) {
      // Storage first: if this throws, the DB row is untouched.
      await deleteVehicleImage(path);
    }

    const { error: deleteError } = await supabase
      .from("vehicle_images")
      .delete()
      .eq("id", imageId);

    if (deleteError) throw new Error(deleteError.message);

    vehiclesCache.clear();
    featuredCache.clear();
  }
}
