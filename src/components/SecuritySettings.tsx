// src/components/settings/SecuritySettings.tsx
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SecuritySettings() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border p-6 shadow-sm">
      <h2 className="text-lg font-bold mb-6">Security</h2>
      <div className="space-y-6">
        <div>
          <Label htmlFor="current-password">Current Password</Label>
          <Input id="current-password" type="password" />
        </div>
        <div>
          <Label htmlFor="new-password">New Password</Label>
          <Input id="new-password" type="password" />
        </div>
        <div>
          <Label htmlFor="confirm-password">Confirm New Password</Label>
          <Input id="confirm-password" type="password" />
        </div>
        <div className="flex justify-end">
          <Button>Change Password</Button>
        </div>
        
        <div className="pt-6 border-t">
          <h3 className="font-medium mb-4">Two-Factor Authentication</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm">Status: <span className="text-red-600">Inactive</span></p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Add an extra layer of security to your account</p>
            </div>
            <Button variant="outline">Enable</Button>
          </div>
        </div>
      </div>
    </div>
  );
}