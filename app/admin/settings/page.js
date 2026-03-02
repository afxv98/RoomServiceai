'use client';

import { useState } from 'react';
import Button from '@/components/shared/Button';
import { Eye, EyeOff, Copy } from 'lucide-react';
import { useNotification } from '@/contexts/NotificationContext';

export default function SettingsPage() {
  const { toast } = useNotification();
  const [showApiKey, setShowApiKey] = useState(false);
  const [featureFlags, setFeatureFlags] = useState({
    voiceOrdering: true,
    multiLanguage: true,
    advancedAnalytics: false,
    betaFeatures: false,
  });
  const [emailProvider, setEmailProvider] = useState('SendGrid');
  const [fromEmail, setFromEmail] = useState('noreply@roomserviceai.com');

  const apiKey = 'sk_live_4f8b9c2d1e6a7h3j5k9m';

  const toggleFeature = (feature) => {
    setFeatureFlags((prev) => ({
      ...prev,
      [feature]: !prev[feature],
    }));
  };

  const handleSaveSettings = () => {
    console.log('Saving settings:', { featureFlags, emailProvider, fromEmail });
    toast.success('Settings saved successfully');
  };

  const handleSaveEmailConfig = () => {
    console.log('Saving email config:', { emailProvider, fromEmail });
    toast.success('Email configuration saved');
  };

  const auditLogs = [
    { timestamp: '2026-01-23 14:32', user: 'admin@roomserviceai.com', action: 'Updated hotel billing for Grand Bay Resort' },
    { timestamp: '2026-01-23 10:15', user: 'admin@roomserviceai.com', action: 'Created new CRM lead: The Dorchester' },
    { timestamp: '2026-01-22 16:45', user: 'support@roomserviceai.com', action: 'Resolved ticket #2 for Cornwall Luxury Hotel' },
    { timestamp: '2026-01-22 09:20', user: 'admin@roomserviceai.com', action: 'Modified pricing for Tier 3 plan' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-charcoal font-playfair mb-2">System Settings</h1>
        <p className="text-gray-600">Manage platform configuration and API keys</p>
      </div>

      {/* API Keys */}
      <div className="bg-white p-6 rounded-sm shadow-md border border-gray-200 mb-6">
        <h2 className="text-xl font-bold mb-4">API Keys</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2">Production API Key</label>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={apiKey}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded-sm bg-gray-50 font-mono text-sm"
                />
              </div>
              <Button
                variant="secondary"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  navigator.clipboard.writeText(apiKey);
                  toast.success('API key copied to clipboard');
                }}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <Button variant="danger" onClick={() => console.log('Regenerate API key')}>
            Regenerate API Key
          </Button>
        </div>
      </div>

      {/* Email Provider Config */}
      <div className="bg-white p-6 rounded-sm shadow-md border border-gray-200 mb-6">
        <h2 className="text-xl font-bold mb-4">Email Provider Configuration</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2">Provider</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-copper"
              value={emailProvider}
              onChange={(e) => setEmailProvider(e.target.value)}
            >
              <option>SendGrid</option>
              <option>Mailgun</option>
              <option>AWS SES</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">From Email</label>
            <input
              type="email"
              value={fromEmail}
              onChange={(e) => setFromEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-copper"
            />
          </div>
          <Button onClick={handleSaveEmailConfig}>Save Configuration</Button>
        </div>
      </div>

      {/* Feature Flags */}
      <div className="bg-white p-6 rounded-sm shadow-md border border-gray-200 mb-6">
        <h2 className="text-xl font-bold mb-4">Feature Flags</h2>
        <div className="space-y-4 mb-4">
          {Object.entries(featureFlags).map(([feature, enabled]) => (
            <label key={feature} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={enabled}
                onChange={() => toggleFeature(feature)}
                className="form-checkbox text-copper w-5 h-5"
              />
              <div>
                <p className="font-medium capitalize">{feature.replace(/([A-Z])/g, ' $1').trim()}</p>
                <p className="text-xs text-gray-500">
                  {feature === 'voiceOrdering' && 'Enable voice ordering for all hotels'}
                  {feature === 'multiLanguage' && 'Enable multi-language support'}
                  {feature === 'advancedAnalytics' && 'Enable advanced analytics dashboard'}
                  {feature === 'betaFeatures' && 'Enable experimental beta features'}
                </p>
              </div>
            </label>
          ))}
        </div>
        <Button onClick={handleSaveSettings}>Save Feature Flags</Button>
      </div>

      {/* Audit Log */}
      <div className="bg-white p-6 rounded-sm shadow-md border border-gray-200">
        <h2 className="text-xl font-bold mb-4">Audit Log</h2>
        <div className="space-y-3">
          {auditLogs.map((log, index) => (
            <div key={index} className="flex gap-4 p-3 bg-gray-50 rounded text-sm">
              <span className="text-gray-500 font-mono whitespace-nowrap">{log.timestamp}</span>
              <span className="text-gray-700 font-medium">{log.user}</span>
              <span className="text-gray-600">{log.action}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
