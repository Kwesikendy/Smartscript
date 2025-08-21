import React from 'react';

export default function TailwindDemo() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-xl shadow-md p-6 space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">Tailwind test</h2>
        <p className="text-gray-600">If you see this styled card, Tailwind is working.</p>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Primary</button>
          <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100">Secondary</button>
        </div>
      </div>
    </div>
  );
}
