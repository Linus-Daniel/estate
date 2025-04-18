"use client";
import { form } from "@/constant";
import { useState, ChangeEvent, FormEvent } from "react";

interface FormItem {
  label: string;
  name: string;
  placeholder: string;
}

interface FormData {
  [key: string]: string;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

function Profile() {
  const [formData, setFormData] = useState<FormData>({});

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    key?: string
  ) => {
    const { name, value } = e.target;
    const field = key || name;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleProfileUpdate = () => {
    console.log("Profile updated:", formData);
  };

  const handlePasswordSubmit = (e: FormEvent) => {
    e.preventDefault();
    const { newPassword, confirmPassword } = formData;
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Password changed:", newPassword);
  };

  return (
    <main className="bg-[#ecf0f5] p-4 min-h-screen flex items-start justify-center">
      <div className="flex flex-col lg:flex-row gap-6 w-full max-w-6xl">
        {/* Profile Section */}
        <section className="flex-1 bg-white shadow rounded p-6">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">
            Edit Profile
          </h2>
          {form.map((item: FormItem, index: number) => (
            <div key={index} className="mb-4">
              <label className="block text-sm font-medium mb-1">
                {item.label}
              </label>
              <input
                name={item.name}
                placeholder={item.placeholder}
                value={formData[item.name] || ""}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-pink-200 text-sm"
              />
            </div>
          ))}

          <button
            className="bg-pink-500 hover:bg-pink-600 text-white text-sm font-medium py-2 px-4 rounded"
            onClick={handleProfileUpdate}
          >
            Update Profile
          </button>
        </section>

        {/* Password Section */}
        <section className="flex-1 bg-white shadow rounded p-6">
          <form onSubmit={handlePasswordSubmit}>
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">
              Change Password
            </h2>

            <div className="mb-4">
              <label
                htmlFor="oldPassword"
                className="block text-sm font-medium mb-1"
              >
                Old Password
              </label>
              <input
                type="password"
                id="oldPassword"
                name="oldPassword"
                placeholder="Enter Old Password"
                value={formData.oldPassword || ""}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-red-200"
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium mb-1"
              >
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                placeholder="Enter New Password"
                value={formData.newPassword || ""}
                onChange={handleInputChange}
                className="w-full border border-gray-300 text-sm rounded px-3 py-2 focus:outline-none focus:ring focus:ring-red-200"
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium mb-1"
              >
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm New Password"
                value={formData.confirmPassword || ""}
                onChange={handleInputChange}
                className="w-full border border-gray-300 text-sm rounded px-3 py-2 focus:outline-none focus:ring focus:ring-red-200"
                required
              />
            </div>

            <button
              type="submit"
              className="bg-[#f4303c] hover:bg-red-600 text-white text-sm font-medium py-2 px-6 rounded"
            >
              Update Password
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}

export default Profile;
