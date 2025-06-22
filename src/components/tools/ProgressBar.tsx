import React from 'react';

interface ProgressBarProps {
  progress: number; // de 0 à 1
  label?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, label }) => (
  <div className="w-full flex flex-col gap-1">
    {label && <span className="text-sm font-medium text-blue-900">{label}</span>}
    <div className="w-full h-4 bg-blue-100 rounded-lg overflow-hidden">
      <div
        className="h-4 bg-blue-600 transition-all duration-300"
        style={{ width: `${Math.round(progress * 100)}%` }}
      />
    </div>
    <span className="text-xs text-gray-600 mt-1">{Math.round(progress * 100)}%</span>
  </div>
);
