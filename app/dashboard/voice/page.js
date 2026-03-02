'use client';

import { useState } from 'react';
import Button from '@/components/shared/Button';
import { ToggleLeft, ToggleRight } from 'lucide-react';
import { useNotification } from '@/contexts/NotificationContext';

export default function VoiceAISettingsPage() {
  const { toast } = useNotification();
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [accent, setAccent] = useState('british');
  const [tone, setTone] = useState('professional');
  const [hours, setHours] = useState('24/7');
  const [features, setFeatures] = useState({
    allergySafety: true,
    confirmationRepeat: true,
    transferToHuman: true,
  });

  const handleSave = () => {
    console.log('Saving voice AI settings:', { voiceEnabled, accent, tone, hours, features });
    toast.success('Voice AI settings saved successfully!');
  };

  const toggleFeature = (feature) => {
    setFeatures((prev) => ({
      ...prev,
      [feature]: !prev[feature],
    }));
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-charcoal font-playfair mb-2">Voice AI Settings</h1>
        <p className="text-gray-600">Configure voice ordering behavior</p>
      </div>

      {/* Voice Ordering Toggle */}
      <div className="bg-white p-6 rounded-sm shadow-md border border-gray-200 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold mb-2">Voice Ordering</h2>
            <p className="text-sm text-gray-600">
              Enable AI-powered voice ordering for phone calls
            </p>
          </div>
          <button
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className={`flex items-center gap-2 ${
              voiceEnabled ? 'text-green-600' : 'text-gray-400'
            }`}
          >
            {voiceEnabled ? (
              <ToggleRight className="w-12 h-12" />
            ) : (
              <ToggleLeft className="w-12 h-12" />
            )}
          </button>
        </div>
      </div>

      {voiceEnabled && (
        <>
          {/* Voice Accent */}
          <div className="bg-white p-6 rounded-sm shadow-md border border-gray-200 mb-6">
            <h2 className="text-xl font-bold mb-4">Voice Accent</h2>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-copper"
              value={accent}
              onChange={(e) => setAccent(e.target.value)}
            >
              <option value="british">British English</option>
              <option value="american">American English</option>
              <option value="neutral">Neutral English</option>
              <option value="australian">Australian English</option>
            </select>
          </div>

          {/* Voice Tone */}
          <div className="bg-white p-6 rounded-sm shadow-md border border-gray-200 mb-6">
            <h2 className="text-xl font-bold mb-4">Conversational Tone</h2>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-copper"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
            >
              <option value="professional">Professional & Formal</option>
              <option value="friendly">Friendly & Warm</option>
              <option value="concise">Concise & Efficient</option>
            </select>
          </div>

          {/* Operating Hours */}
          <div className="bg-white p-6 rounded-sm shadow-md border border-gray-200 mb-6">
            <h2 className="text-xl font-bold mb-4">Voice AI Operating Hours</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="hours"
                  value="24/7"
                  checked={hours === '24/7'}
                  onChange={(e) => setHours(e.target.value)}
                  className="form-radio text-copper"
                />
                <span className="font-medium">24/7 (Always On)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="hours"
                  value="custom"
                  checked={hours === 'custom'}
                  onChange={(e) => setHours(e.target.value)}
                  className="form-radio text-copper"
                />
                <span className="font-medium">Custom Hours</span>
              </label>
            </div>
            {hours === 'custom' && (
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2">Start Time</label>
                  <input
                    type="time"
                    className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-copper"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">End Time</label>
                  <input
                    type="time"
                    className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-copper"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Call Handling Features */}
          <div className="bg-white p-6 rounded-sm shadow-md border border-gray-200 mb-6">
            <h2 className="text-xl font-bold mb-4">Call Handling Features</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={features.allergySafety}
                  onChange={() => toggleFeature('allergySafety')}
                  className="form-checkbox text-copper w-5 h-5"
                />
                <div>
                  <p className="font-medium">Allergy Safety Checks</p>
                  <p className="text-sm text-gray-500">
                    AI proactively asks about allergies and logs them
                  </p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={features.confirmationRepeat}
                  onChange={() => toggleFeature('confirmationRepeat')}
                  className="form-checkbox text-copper w-5 h-5"
                />
                <div>
                  <p className="font-medium">Order Confirmation Repeat</p>
                  <p className="text-sm text-gray-500">
                    AI reads back the full order for guest confirmation
                  </p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={features.transferToHuman}
                  onChange={() => toggleFeature('transferToHuman')}
                  className="form-checkbox text-copper w-5 h-5"
                />
                <div>
                  <p className="font-medium">Transfer to Human</p>
                  <p className="text-sm text-gray-500">
                    Allow guests to request speaking to a staff member
                  </p>
                </div>
              </label>
            </div>
          </div>
        </>
      )}

      {/* Save Button */}
      <Button onClick={handleSave}>Save Voice AI Settings</Button>
    </div>
  );
}
