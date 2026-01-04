import React from 'react';
import { Cloud, Plane } from 'lucide-react';

export const Background: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Large background clouds */}
      <Cloud className="absolute text-slate-200/40 dark:text-slate-800/40 w-96 h-96 -top-20 -left-20 animate-drift-slow" />
      <Cloud className="absolute text-slate-200/30 dark:text-slate-800/30 w-[500px] h-[500px] top-1/3 -right-40 animate-drift-slower" />
      
      {/* Floating smaller clouds */}
      <div className="absolute top-20 left-1/4 animate-float-slow">
        <Cloud className="text-blue-100/50 dark:text-slate-700/30 w-24 h-24" />
      </div>
      <div className="absolute bottom-1/3 right-1/3 animate-float-slower">
        <Cloud className="text-blue-100/50 dark:text-slate-700/30 w-32 h-32" />
      </div>

      {/* Distant Plane */}
      <div className="absolute top-32 -left-20 animate-fly-across opacity-20 dark:opacity-10">
        <Plane className="text-blue-400 w-16 h-16 transform rotate-90" />
      </div>
    </div>
  );
};
