'use client';

import { useState } from 'react';
import Button from '@/components/shared/Button';
import { useNotification } from '@/contexts/NotificationContext';

export default function UpsellSettingsPage() {
  const { toast } = useNotification();
  const [upsellMode, setUpsellMode] = useState('balanced');
  const [enabledCategories, setEnabledCategories] = useState({
    drinks: true,
    desserts: true,
    premiumAddons: false,
  });
  const [maxUpsells, setMaxUpsells] = useState(2);

  const handleSave = () => {
    console.log('Saving upsell settings:', { upsellMode, enabledCategories, maxUpsells });
    toast.success('Upsell settings saved successfully!');
  };

  const toggleCategory = (category) => {
    setEnabledCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-charcoal font-playfair mb-2">AI Upsell Settings</h1>
        <p className="text-gray-600">Configure intelligent upsell behavior</p>
      </div>

      {/* Upsell Mode */}
      <div className="bg-white p-6 rounded-sm shadow-md border border-gray-200 mb-6">
        <h2 className="text-xl font-bold mb-4">Upsell Mode</h2>
        <div className="space-y-3">
          <label className="flex items-start p-4 bg-gray-50 rounded cursor-pointer hover:bg-gray-100 transition-colors">
            <input
              type="radio"
              name="upsellMode"
              value="conservative"
              checked={upsellMode === 'conservative'}
              onChange={(e) => setUpsellMode(e.target.value)}
              className="mt-1 form-radio text-copper"
            />
            <div className="ml-3">
              <p className="font-bold">Conservative</p>
              <p className="text-sm text-gray-600">
                Only suggest upsells when highly relevant. Minimal prompting.
              </p>
            </div>
          </label>

          <label className="flex items-start p-4 bg-gray-50 rounded cursor-pointer hover:bg-gray-100 transition-colors">
            <input
              type="radio"
              name="upsellMode"
              value="balanced"
              checked={upsellMode === 'balanced'}
              onChange={(e) => setUpsellMode(e.target.value)}
              className="mt-1 form-radio text-copper"
            />
            <div className="ml-3">
              <p className="font-bold">Balanced (Recommended)</p>
              <p className="text-sm text-gray-600">
                Smart suggestions based on order context. Good conversion without being pushy.
              </p>
            </div>
          </label>

          <label className="flex items-start p-4 bg-gray-50 rounded cursor-pointer hover:bg-gray-100 transition-colors">
            <input
              type="radio"
              name="upsellMode"
              value="aggressive"
              checked={upsellMode === 'aggressive'}
              onChange={(e) => setUpsellMode(e.target.value)}
              className="mt-1 form-radio text-copper"
            />
            <div className="ml-3">
              <p className="font-bold">Aggressive</p>
              <p className="text-sm text-gray-600">
                Maximum upsells. Suggest multiple items per order. Higher revenue potential.
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Upsell Categories */}
      <div className="bg-white p-6 rounded-sm shadow-md border border-gray-200 mb-6">
        <h2 className="text-xl font-bold mb-4">Upsell Categories</h2>
        <p className="text-sm text-gray-600 mb-4">
          Select which types of items the AI can suggest as upsells
        </p>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={enabledCategories.drinks}
              onChange={() => toggleCategory('drinks')}
              className="form-checkbox text-copper w-5 h-5"
            />
            <div>
              <p className="font-medium">Drinks</p>
              <p className="text-sm text-gray-500">Wine, beer, cocktails, soft drinks</p>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={enabledCategories.desserts}
              onChange={() => toggleCategory('desserts')}
              className="form-checkbox text-copper w-5 h-5"
            />
            <div>
              <p className="font-medium">Desserts</p>
              <p className="text-sm text-gray-500">Sweet treats to complete the meal</p>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={enabledCategories.premiumAddons}
              onChange={() => toggleCategory('premiumAddons')}
              className="form-checkbox text-copper w-5 h-5"
            />
            <div>
              <p className="font-medium">Premium Add-ons</p>
              <p className="text-sm text-gray-500">
                Extras like truffle oil, premium cheese, caviar
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Max Upsells Per Order */}
      <div className="bg-white p-6 rounded-sm shadow-md border border-gray-200 mb-6">
        <h2 className="text-xl font-bold mb-4">Max Upsells Per Order</h2>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="1"
            max="5"
            value={maxUpsells}
            onChange={(e) => setMaxUpsells(parseInt(e.target.value))}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-copper"
          />
          <span className="text-2xl font-bold text-copper w-12 text-center">{maxUpsells}</span>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Maximum number of upsell suggestions per order
        </p>
      </div>

      {/* AI Example Preview */}
      <div className="bg-white p-6 rounded-sm shadow-md border border-gray-200 mb-6">
        <h2 className="text-xl font-bold mb-4">Preview</h2>
        <p className="text-sm text-gray-600 mb-4">
          Example AI message with current settings ({upsellMode} mode)
        </p>
        <div className="bg-gray-50 p-4 rounded border-l-4 border-copper">
          <p className="text-gray-700 italic">
            "Great choice! Would you like to add a glass of our house red wine to complement your
            steak?"
          </p>
        </div>
      </div>

      {/* Save Button */}
      <Button onClick={handleSave}>Save Upsell Settings</Button>
    </div>
  );
}
