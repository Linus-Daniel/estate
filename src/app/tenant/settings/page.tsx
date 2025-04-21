// app/tenant/settings/page.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SettingsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Settings</h1>
      <Tabs defaultValue="profile" className="max-w-3xl">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <div className="space-y-4 mt-4">
            <Input placeholder="Full Name" />
            <Input placeholder="Email" />
            <Input placeholder="Phone Number" />
            <Button className="bg-blue-600 hover:bg-blue-700">Save Changes</Button>
          </div>
        </TabsContent>
        <TabsContent value="notifications">
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <p>Rent Due Reminders</p>
              {/* <Toggle /> */}
            </div>
            <div className="flex items-center justify-between">
              <p>Maintenance Updates</p>
              {/* <Toggle /> */}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}