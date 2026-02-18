'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

const PRESET_COLORS = [
  { name: 'Pink', value: '#ec4899' },
  { name: 'Rose', value: '#f43f5e' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Cyan', value: '#06b6d4' },
  { name: 'Teal', value: '#14b8a6' },
  { name: 'Emerald', value: '#10b981' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Red', value: '#ef4444' },
];

export default function ColorPicker({
  value,
  onChange,
}: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customColor, setCustomColor] = useState(value);

  const handleColorSelect = (color: string) => {
    onChange(color);
    setCustomColor(color);
    setIsOpen(false);
  };

  const handleCustomColorChange = (color: string) => {
    setCustomColor(color);
    onChange(color);
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border-2 border-gray-200 hover:border-gray-300 transition-colors shadow-sm"
        title="Select accent color"
      >
        <div
          className="w-6 h-6 rounded-full border-2 border-gray-300 shadow-md"
          style={{ backgroundColor: value }}
        />
        <ChevronDown size={18} className="text-gray-600" />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 left-0 bg-white rounded-xl shadow-xl p-4 z-50 w-80">
          {/* Preset Colors */}
          <div className="mb-4">
            <p className="text-sm font-semibold text-gray-700 mb-3">Presets</p>
            <div className="grid grid-cols-5 gap-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color.value}
                  onClick={() => handleColorSelect(color.value)}
                  className={`w-12 h-12 rounded-lg transition-all border-2 ${
                    value === color.value
                      ? 'border-gray-800 shadow-lg'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Custom Color Input */}
          <div className="border-t border-gray-200 pt-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">Custom Color</p>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={customColor}
                onChange={(e) => handleCustomColorChange(e.target.value)}
                className="w-12 h-12 rounded-lg cursor-pointer border-2 border-gray-200"
              />
              <input
                type="text"
                value={customColor}
                onChange={(e) => handleCustomColorChange(e.target.value)}
                placeholder="#ec4899"
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
