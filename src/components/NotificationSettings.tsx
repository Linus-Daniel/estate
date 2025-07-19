// src/components/settings/NotificationSettings.tsx
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function NotificationSettings() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border p-6 shadow-sm">
      <h2 className="text-lg font-bold mb-6">Notification Preferences</h2>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="property-alerts">New Property Alerts</Label>
            <p className="text-sm text-gray-500 dark:text-gray-400">Notify me when new properties are added</p>
          </div>
          <Switch id="property-alerts" defaultChecked />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="message-alerts">New Message Alerts</Label>
            <p className="text-sm text-gray-500 dark:text-gray-400">Notify me when I receive new messages</p>
          </div>
          <Switch id="message-alerts" defaultChecked />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="task-alerts">Task Reminders</Label>
            <p className="text-sm text-gray-500 dark:text-gray-400">Notify me about upcoming tasks</p>
          </div>
          <Switch id="task-alerts" defaultChecked />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="update-alerts">System Updates</Label>
            <p className="text-sm text-gray-500 dark:text-gray-400">Notify me about system updates</p>
          </div>
          <Switch id="update-alerts" />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="promotion-alerts">Promotions</Label>
            <p className="text-sm text-gray-500 dark:text-gray-400">Notify me about special offers</p>
          </div>
          <Switch id="promotion-alerts" />
        </div>
      </div>
    </div>
  );
}