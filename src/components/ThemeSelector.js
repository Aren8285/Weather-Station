import React from 'react';

export default function ThemeSelector({ theme, setTheme }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-full p-2 shadow">
      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        className="bg-transparent outline-none px-2 py-1"
      >
        <option value="sakura">Sakura</option>
        <option value="bubblegum">Bubblegum</option>
        <option value="midnight">Midnight</option>
        <option value="cotton">Cotton Candy</option>
      </select>
    </div>
  );
}
