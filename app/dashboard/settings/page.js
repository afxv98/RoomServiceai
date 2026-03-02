'use client';

import { useState } from 'react';
import Button from '@/components/shared/Button';
import { useNotification } from '@/contexts/NotificationContext';

export default function SettingsPage() {
  const { toast } = useNotification();
  const [hotelName, setHotelName] = useState('Grand Bay Resort');
  const [language, setLanguage] = useState('English');
  const [timezone, setTimezone] = useState('Europe/London');

  const handleSave = () => {
    console.log('Saving settings:', { hotelName, language, timezone });
    toast.success('Settings saved successfully!');
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-charcoal font-playfair mb-2">Settings</h1>
        <p className="text-gray-600">Manage hotel configuration and account settings</p>
      </div>

      {/* Hotel Information */}
      <div className="bg-white p-6 rounded-sm shadow-md border border-gray-200 mb-6">
        <h2 className="text-xl font-bold mb-4">Hotel Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2">Hotel Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-copper"
              value={hotelName}
              onChange={(e) => setHotelName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Primary Language</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-copper"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option>English</option>
              <option>French</option>
              <option>Spanish</option>
              <option>German</option>
              <option>Italian</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Timezone</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-copper"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
            >
              <option>Europe/London</option>
              <option>Europe/Paris</option>
              <option>America/New_York</option>
              <option>America/Los_Angeles</option>
              <option>Asia/Tokyo</option>
              <option>Australia/Sydney</option>
            </select>
          </div>

          <Button onClick={handleSave}>Save Hotel Information</Button>
        </div>
      </div>

      {/* Billing Information (Read-only) */}
      <div className="bg-white p-6 rounded-sm shadow-md border border-gray-200 mb-6">
        <h2 className="text-xl font-bold mb-4">Billing & Subscription</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between p-3 bg-gray-50 rounded">
            <span className="font-medium">Current Plan:</span>
            <span className="font-bold">Tier 4 - Large Hotel / Resort</span>
          </div>
          <div className="flex justify-between p-3 bg-gray-50 rounded">
            <span className="font-medium">Room Count:</span>
            <span className="font-bold">320 rooms</span>
          </div>
          <div className="flex justify-between p-3 bg-gray-50 rounded">
            <span className="font-medium">Monthly Fee:</span>
            <span className="font-bold">£4,125 / month</span>
          </div>
          <div className="flex justify-between p-3 bg-gray-50 rounded">
            <span className="font-medium">Next Invoice:</span>
            <span className="font-bold">February 1, 2026</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-4">
          To update billing information or change plans, please contact support.
        </p>
      </div>

      {/* Contact Support */}
      <div className="bg-blue-50 p-6 rounded-sm border-l-4 border-blue-500">
        <h3 className="font-bold text-blue-900 mb-2">Need Help?</h3>
        <p className="text-sm text-blue-800 mb-3">
          Our support team is available 24/7 to help with any questions or technical issues.
        </p>
        <a
          href="mailto:support@roomserviceai.com"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded-sm text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Contact Support
        </a>
      </div>
    </div>
  );
}
