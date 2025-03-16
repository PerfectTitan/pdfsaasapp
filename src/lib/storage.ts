import { supabase } from "./supabase";

export const STORAGE_BUCKET = "documents";

// Initialize the storage bucket if it doesn't exist
export const initializeStorage = async () => {
  // Check if bucket exists
  const { data: buckets } = await supabase.storage.listBuckets();
  const bucketExists = buckets?.some(
    (bucket) => bucket.name === STORAGE_BUCKET,
  );

  if (!bucketExists) {
    // Create the bucket if it doesn't exist
    const { error } = await supabase.storage.createBucket(STORAGE_BUCKET, {
      public: false,
      fileSizeLimit: 10485760, // 10MB
    });

    if (error) {
      console.error("Error creating storage bucket:", error);
      return false;
    }
  }

  return true;
};

// Upload a file to storage
export const uploadFile = async (
  file: File,
  userId: string,
): Promise<{
  path?: string;
  error?: Error;
}> => {
  try {
    // Create a unique file path using userId and timestamp
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    // Upload the file
    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    // Get the public URL
    const { data } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filePath);

    return { path: data.publicUrl };
  } catch (error) {
    console.error("Error uploading file:", error);
    return { error: error as Error };
  }
};

// Delete a file from storage
export const deleteFile = async (
  filePath: string,
): Promise<{ error?: Error }> => {
  try {
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([filePath]);

    if (error) {
      throw error;
    }

    return {};
  } catch (error) {
    console.error("Error deleting file:", error);
    return { error: error as Error };
  }
};
