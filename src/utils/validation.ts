// utils/validation.ts
export const validateFormFields = (formData: any, requiredFields: string[]) => {
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        return `Please fill all required fields`;
      }
    }
    return null;
  };
  
  export const validateFileGroups = (formData: any) => {
    const fileGroups = Object.entries(formData).filter(
      ([, value]) => Array.isArray(value) && value.every((file: any) => file instanceof File)
    );
  
    if (fileGroups.length === 0) {
      return { error: "Please upload at least one image", fileGroups: [] };
    }
  
    return { error: null, fileGroups };
  };
  