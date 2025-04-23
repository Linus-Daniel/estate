"use client"
// app/tenant/settings/page.tsx
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function SettingsPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [rentReminders, setRentReminders] = useState(true);
  const [maintenanceUpdates, setMaintenanceUpdates] = useState(true);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle profile update logic
  };

  const handleSubmitSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle security update logic
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Account Settings</h1>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="mt-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-1/3">
                <h2 className="text-xl font-semibold mb-4">Profile Picture</h2>
                <div className="flex flex-col items-center gap-4">
                  <Avatar className="w-32 h-32">
                    <AvatarImage src={profileImage || "/default-avatar.png"} />
                    <AvatarFallback className="text-4xl">
                      {name ? name.charAt(0).toUpperCase() : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="relative">
                    <Button variant="outline" className="relative">
                      Upload Photo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500 text-center">
                    JPG, GIF or PNG. Max size of 2MB
                  </p>
                </div>
              </div>

              <div className="w-full md:w-2/3">
                <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
                <form onSubmit={handleSubmitProfile} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div className="flex justify-end pt-4">
                    <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2">
                      Save Changes
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="mt-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-6">Notification Preferences</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">Rent Due Reminders</h3>
                  <p className="text-sm text-gray-500">
                    Receive notifications when your rent payment is due
                  </p>
                </div>
                <Switch
                  checked={rentReminders}
                  onCheckedChange={setRentReminders}
                  className="data-[state=checked]:bg-indigo-600"
                />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">Maintenance Updates</h3>
                  <p className="text-sm text-gray-500">
                    Get notified about maintenance requests and updates
                  </p>
                </div>
                <Switch
                  checked={maintenanceUpdates}
                  onCheckedChange={setMaintenanceUpdates}
                  className="data-[state=checked]:bg-indigo-600"
                />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">Community Announcements</h3>
                  <p className="text-sm text-gray-500">
                    Important updates from property management
                  </p>
                </div>
                <Switch
                  checked={true}
                  onCheckedChange={() => {}}
                  className="data-[state=checked]:bg-indigo-600"
                  disabled
                />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="mt-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-6">Security Settings</h2>
            <form onSubmit={handleSubmitSecurity} className="space-y-6 max-w-2xl">
              <div>
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter your current password"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
              <div className="pt-2">
                <p className="text-sm text-gray-500">
                  Password must be at least 8 characters long and contain at least one number and one special character.
                </p>
              </div>
              <div className="flex justify-end pt-4">
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2">
                  Update Password
                </Button>
              </div>
            </form>

            <div className="mt-10 pt-6 border-t">
              <h3 className="font-medium text-red-600 mb-2">Danger Zone</h3>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-red-50 rounded-lg">
                <div>
                  <p className="font-medium">Delete Account</p>
                  <p className="text-sm text-gray-600">
                    Permanently remove your account and all associated data
                  </p>
                </div>
                <Button variant="destructive">Delete Account</Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}