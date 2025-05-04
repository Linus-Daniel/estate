"use client";
import { form } from "@/constant";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { Lock, User, Mail, Phone, Edit, Check, Eye, EyeOff } from "lucide-react";
import { useAuth, User as UserType } from "@/context/auth_context";
import { useRouter } from "next/navigation";

interface FormItem {
  label: string;
  name: string;
  placeholder: string;
  icon?: React.ReactNode;
  type?: string;
}

interface FormData {
  [key: string]: string;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

function Profile() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState<FormData | any>({});
  const [showPassword, setShowPassword] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check authentication and role on initial render
  useEffect(() => {
    if (!user) {
      router.push("/auth");
      return;
    }
    
    if (user.role !== "agent") {
      router.push("/auth");
      return;
    }
    console.log(user)

    // Initialize form data with user profile
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      oldPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
  }, [user, router]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>, key?: string) => {
    const { name, value } = e.target;
    const field = key || name;
    setFormData((prev: FormData) => ({
      ...prev,
      [field]: value,
    }));
  };

  const togglePasswordVisibility = (field: keyof typeof showPassword) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleProfileUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log("Profile updated:", formData);
      setIsEditing(false);
      
      // In a real app, you would update the user context here
      // with the new profile data from the API response
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { newPassword, confirmPassword } = formData;
      if (newPassword !== confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log("Password changed successfully");
      
      // Clear password fields
      setFormData((prev:any) => ({
        ...prev,
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
      }));
    } catch (error) {
      console.error("Password change failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Enhanced form fields with icons
  const enhancedForm = form.map(item => {
    let icon;
    switch(item.name) {
      case 'name':
        icon = <User className="h-4 w-4 text-gray-400" />;
        break;
      case 'email':
        icon = <Mail className="h-4 w-4 text-gray-400" />;
        break;
      case 'phone':
        icon = <Phone className="h-4 w-4 text-gray-400" />;
        break;
      default:
        icon = <User className="h-4 w-4 text-gray-400" />;
    }
    return { ...item, icon };
  });

  if (!user || user.role !== "agent") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p>Loading or unauthorized access...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-gray-50 p-4 min-h-screen flex items-start justify-center py-8">
      <div className="flex flex-col lg:flex-row gap-6 w-full max-w-6xl">
        {/* Profile Section */}
        <section className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-4 text-white">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </h2>
            <p className="text-sm opacity-90 mt-1">Agent ID: {user._id}</p>
          </div>
          
          <form onSubmit={handleProfileUpdate} className="p-6">
            <div className="flex justify-between mb-4">
              <span className="text-sm font-medium text-gray-500">
                Role: <span className="text-pink-600 capitalize">{user.role}</span>
              </span>
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-1 text-sm font-medium text-pink-600 hover:text-pink-700"
              >
                {isEditing ? (
                  <>
                    <Check className="h-4 w-4" />
                    Done Editing
                  </>
                ) : (
                  <>
                    <Edit className="h-4 w-4" />
                    Edit Profile
                  </>
                )}
              </button>
            </div>

            <div className="space-y-4">
              {enhancedForm.map((item: FormItem, index: number) => (
                <div key={index} className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {item.label}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      {item.icon}
                    </div>
                    <input
                      name={item.name}
                      type={item.type || "text"}
                      placeholder={item.placeholder}
                      value={formData[item.name] || ""}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full border ${isEditing ? "border-gray-300 focus:ring-2 focus:ring-pink-200" : "border-transparent bg-gray-50"} rounded-lg pl-10 pr-3 py-2 focus:outline-none transition-colors text-sm`}
                    />
                  </div>
                </div>
              ))}
            </div>

            {isEditing && (
              <div className="flex gap-3 mt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex-1 flex justify-center items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-medium py-2.5 px-4 rounded-lg shadow-sm transition-all ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </>
                  ) : (
                    "Update Profile"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 border border-gray-300 text-gray-700 font-medium py-2.5 px-4 rounded-lg shadow-sm hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
              </div>
            )}
          </form>
        </section>

        {/* Password Section */}
        <section className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-4 text-white">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Change Password
            </h2>
          </div>

          <form onSubmit={handlePasswordSubmit} className="p-6">
            <div className="space-y-4">
              <div className="mb-4">
                <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type={showPassword.oldPassword ? "text" : "password"}
                    id="oldPassword"
                    name="oldPassword"
                    placeholder="Enter current password"
                    value={formData.oldPassword || ""}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg pl-10 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('oldPassword')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword.oldPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type={showPassword.newPassword ? "text" : "password"}
                    id="newPassword"
                    name="newPassword"
                    placeholder="Enter new password"
                    value={formData.newPassword || ""}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg pl-10 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('newPassword')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword.newPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type={showPassword.confirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm new password"
                    value={formData.confirmPassword || ""}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg pl-10 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirmPassword')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword.confirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`mt-4 w-full flex justify-center items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium py-2.5 px-4 rounded-lg shadow-sm transition-all ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </>
              ) : (
                "Change Password"
              )}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}

export default Profile;