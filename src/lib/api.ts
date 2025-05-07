import { PaymentPropsTypes } from "@/types";
import axios from "axios";



const api = axios.create({
  baseURL: "https://estate-backend-4hk1.onrender.com/api/v1",
  // baseURL: "http://localhost:5000/api/v1",

  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,


  },
  withCredentials: true,
});

export default api;

// Example using fetch
export async function getCsrfToken() {
  try {
    const response = await api.get("/csrf-token", {
      withCredentials: true, // send cookies
    });
    return response.data.csrfToken;
  } catch (error) {
    console.error(error);
  }
}

interface UserData {
  name: string;
  email: string;
  password: string;
  role?: string;
  phone?: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface UpdateDetailsData {
  name?: string;
  email?: string;
  phone?: string;
}

interface UpdatePasswordData {
  currentPassword: string;
  newPassword: string;
}

interface ForgotPasswordData {
  email: string;
}

interface ResetPasswordData {
  password: string;
  confirmPassword: string;
}

// Image Upload Types
interface UploadResponse {
  success: boolean;
  data: {
    url: string;
    public_id: string;
  };
}

// Register user
export const register = async (userData: UserData) => {
  try {
    const csrfToken = await getCsrfToken();
    console.log(csrfToken);
    const response = await api.post("/auth/register", userData, {
      headers: {
        "x-csrf-token": csrfToken,
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Registration failed");
    }
    throw new Error("Registration failed");
  }
};

// Login user
export const login = async (loginData: LoginData) => {
  try {
    const csrfToken = await getCsrfToken();
    console.log(csrfToken);
    localStorage.setItem("csrfToken", csrfToken);

    console.log("atempting login in....", loginData);
    const response = await api.post("/auth/login", loginData, {
      headers: {
        "x-csrf-token": csrfToken,
      },
      withCredentials: true,
    });
    console.log(response);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
    throw new Error("Login failed");
  }
};

// Get current user
export const getMe = async (token: string) => {
  const response = await api.get(`/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Update user details
export const updateDetails = async (
  details: { name?: string; email?: string; phone?: string },
  token: string
) => {
  const response = await api.put(`/auth/updatedetails`, details, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Update password
export const updatePassword = async (
  passwords: { currentPassword: string; newPassword: string },
  token: string
) => {
  const response = await api.put(`/auth/updatepassword`, passwords, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Forgot password
export const forgotPassword = async (email: string) => {
  const response = await api.post(`/auth/forgotpassword`, { email });
  return response.data;
};

// Reset password
export const resetPassword = async (
  token: string,
  passwords: { password: string }
) => {
  const response = await api.put(`/auth/resetpassword/${token}`, passwords);
  return response.data;
};

// Logout (handled client-side)
export const logout = () => {
  // Remove token from localStorage
  localStorage.removeItem("token");
};

// Image Upload Functions
export const uploadImage = async (
  file: File,
  token: string
): Promise<UploadResponse> => {
  console.log(file);
  try {
    const csrfToken = await getCsrfToken();
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
        "x-csrf-token": csrfToken,
      },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Image upload failed");
    }
    throw new Error("Image upload failed");
  }
};

export const deleteImage = async (
  publicId: string,
  token: string
): Promise<void> => {
  try {
    const csrfToken = await getCsrfToken();
    await api.delete(`/upload/${publicId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "x-csrf-token": csrfToken,
      },
      withCredentials: true,
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Image deletion failed");
    }
    throw new Error("Image deletion failed");
  }
};

// payment handling
export const handlePayment = async ({
  propertyId,
  email,
}: PaymentPropsTypes) => {
  try {
    const csrfToken = await getCsrfToken();
    console.log(csrfToken);
    const res = await api.post(
      "/payments/initialize",
      {
        propertyId,
        email: email,
        callback_url: "http://localhost:3000/user/payment",
      },
      {
        headers: {
          "x-csrf-token": csrfToken,
        },

        withCredentials: true,
      }
    );

    const { authorizationUrl } = res.data;

    // Redirect user to Paystack checkout
    window.location.href = authorizationUrl;
  } catch (error: any) {
    console.error(
      "Payment initialization failed:",
      error.response?.data || error.message
    );
    alert("Unable to initialize payment. Please try again.");
  }
};

export const getUserTransactions = async (userId: string) => {
  const csrfToken = await getCsrfToken();
  try {
    const response = await api.get(`/payments/transactions/${userId}`, {
      headers: {
        "x-csrf-token": csrfToken,
      Authorization: `Bearer ${localStorage.getItem("token")}`,

    
      },
      withCredentials: true,
    });

    console.log(response.data?.data);

    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};

export const getUserTransactionById = async (id: string) => {
  const csrfToken = await getCsrfToken();
  console.log(csrfToken, localStorage.getItem("token"))

  try {
    const response = await api.get(`/payments/transaction/${id}`, {
      headers: {
        "x-csrf-token": csrfToken,
      Authorization: `Bearer ${localStorage.getItem("token")}`,

      },
      withCredentials: true,
    });

    console.log(response);

    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};
