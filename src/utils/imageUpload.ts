// utils/imageUpload.ts
import api from "@/lib/api"; // adjust to your actual api path

export const uploadImageGroup = async (
  fileArray: File[],
  csrfToken: string,
  token: string,
  onUploadProgress: (percent: number) => void
) => {
  return await Promise.all(
    fileArray.map((file) => {
      const fileFormData = new FormData();
      fileFormData.append("image", file);

      return api.post("/upload", fileFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-csrf-token": csrfToken,
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
        timeout: 30000,
        onUploadProgress: (e) => {
          const percentCompleted = Math.round((e.loaded * 100) / (e.total || 1));
          onUploadProgress(percentCompleted);
        },
      });
    })
  );
};

export const parseUploadResponse = (uploadResults: any[]) => {
  return uploadResults.flatMap((res) => {
    const images = res.data?.data;

    if (Array.isArray(images)) {
      return images.map((img: any) => ({
        public_id: img.public_id,
        url: img.url,
      }));
    } else if (images && typeof images === "object") {
      return [{ public_id: images.public_id, url: images.url }];
    } else {
      return [];
    }
  });
};
