import React from 'react';
import { Hotel, Construction } from 'lucide-react';

export const HotelsPage: React.FC = () => {
  return (
    <div className="flex-grow container mx-auto px-4 md:px-6 py-16 flex flex-col items-center justify-center text-center">
      <div className="bg-white dark:bg-slate-800 p-12 rounded-3xl shadow-xl max-w-2xl w-full border border-gray-100 dark:border-slate-700">
        <div className="w-24 h-24 bg-blue-50 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-8">
            <Hotel className="w-12 h-12 text-brand-blue dark:text-blue-400" />
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Hotels Coming Soon</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            We are working hard to bring you the best hotel deals. Stay tuned for updates!
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-500 font-medium uppercase tracking-widest">
            <Construction className="w-4 h-4" />
            <span>Under Construction</span>
        </div>
      </div>
    </div>
  );
};
