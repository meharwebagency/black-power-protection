import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/middleware";
import { VehicleImageService } from "@/lib/services/vehicle-image.service";
import { ALLOWED_TYPES, MAX_FILE_SIZE } from "@/lib/storage/image-upload";
import { getServiceClient } from "@/lib/supabase/server";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const { user, error } = await requireAdmin();
  if (error || !user) {
    return NextResponse.json(
      { success: false, error: error || "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;
    const formData = await request.formData();
    const entries = formData.getAll("images");

    const files: {
      fileName: string;
      fileBuffer: Buffer;
      contentType: string;
    }[] = [];

    for (const entry of entries) {
      if (!(entry instanceof File)) continue;

      if (!ALLOWED_TYPES.includes(entry.type)) {
        return NextResponse.json(
          {
            success: false,
            error: `Invalid file type: ${entry.type}. Allowed: ${ALLOWED_TYPES.join(", ")}`,
          },
          { status: 400 }
        );
      }

      if (entry.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          {
            success: false,
            error: `File "${entry.name}" exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`,
          },
          { status: 400 }
        );
      }

      const arrayBuffer = await entry.arrayBuffer();
      const extMatch = entry.name.match(/\.[a-zA-Z0-9]+$/);
      const ext = extMatch ? extMatch[0] : "";
      const uniqueName = `${Date.now()}-${files.length}${ext}`;

      files.push({
        fileName: uniqueName,
        fileBuffer: Buffer.from(arrayBuffer),
        contentType: entry.type,
      });
    }

    const images = await VehicleImageService.uploadMany(id, files);

    return NextResponse.json({ success: true, data: images });
  } catch (err) {
    console.error("Error uploading vehicle images:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Failed to upload images",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { user, error } = await requireAdmin();
  if (error || !user) {
    return NextResponse.json(
      { success: false, error: error || "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;
    const imageId = request.nextUrl.searchParams.get("imageId");

    if (!imageId) {
      return NextResponse.json(
        { success: false, error: "imageId is required" },
        { status: 400 }
      );
    }

    const supabase = await getServiceClient();

    // Confirm the image exists and belongs to this vehicle before deleting,
    // so one vehicle's edit page can't delete another vehicle's image.
    const { data: image } = await supabase
      .from("vehicle_images")
      .select("id")
      .eq("id", imageId)
      .eq("vehicle_id", id)
      .maybeSingle();

    if (!image) {
      return NextResponse.json(
        { success: false, error: "Image not found for this vehicle" },
        { status: 404 }
      );
    }

    // Guard the last image: never let a vehicle end up with zero images.
    const { count } = await supabase
      .from("vehicle_images")
      .select("id", { count: "exact", head: true })
      .eq("vehicle_id", id);

    if ((count ?? 0) <= 1) {
      return NextResponse.json(
        {
          success: false,
          error: "Cannot delete the last image. Upload another image first.",
        },
        { status: 409 }
      );
    }

    await VehicleImageService.deleteOne(imageId);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error deleting vehicle image:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Failed to delete image",
      },
      { status: 500 }
    );
  }
}
