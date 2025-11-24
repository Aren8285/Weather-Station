import React from 'react';
import { Cloud } from 'lucide-react';

export default function Header({ title = "KAWAII WEATHER", subtitle = "Your Cute Daily Forecast" }) {
  return (
    <div className="flex items-center gap-3">
      <div className="bg-white p-3 rounded-full border-2 border-pink-300 dark:border-pink-500">
        <Cloud className="text-pink-500" size={32} />
      </div>
      <div>
        <h1 className="text-3xl font-black text-gray-800 dark:text-white tracking-tight">{title}</h1>
        <p className="text-pink-600 dark:text-pink-200 font-medium text-sm">{subtitle}</p>
      </div>
    </div>
  );
}
