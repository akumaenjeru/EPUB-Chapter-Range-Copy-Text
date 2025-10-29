import React from 'react';

interface ControlsProps {
  groupingSize: number;
  setGroupingSize: (size: number) => void;
  manualPattern: string;
  setManualPattern: (pattern: string) => void;
  onPatternUpdate: () => void;
  isLoading: boolean;
}

const Controls: React.FC<ControlsProps> = ({
  groupingSize,
  setGroupingSize,
  manualPattern,
  setManualPattern,
  onPatternUpdate,
  isLoading,
}) => {
  return (
    <div className="w-full bg-gray-800 p-4 rounded-lg shadow-lg flex flex-col sm:flex-row gap-4 items-center">
      <div className="flex-1 w-full sm:w-auto">
        <label htmlFor="grouping-size" className="block text-sm font-medium text-gray-300 mb-1">
          Chapters per Group
        </label>
        <input
          id="grouping-size"
          type="number"
          min="1"
          value={groupingSize}
          onChange={(e) => setGroupingSize(Math.max(1, parseInt(e.target.value, 10)))}
          className="w-full bg-gray-700 border border-gray-600 text-white rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div className="flex-grow w-full sm:w-auto">
        <label htmlFor="manual-pattern" className="block text-sm font-medium text-gray-300 mb-1">
          Manual Chapter Pattern (optional)
        </label>
        <div className="flex gap-2">
          <input
            id="manual-pattern"
            type="text"
            placeholder='e.g., Chapter * or 第*章'
            value={manualPattern}
            onChange={(e) => setManualPattern(e.target.value)}
            className="flex-grow bg-gray-700 border border-gray-600 text-white rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <button
            onClick={onPatternUpdate}
            disabled={isLoading}
            className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors duration-300"
          >
            {isLoading ? '...' : 'Update'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Controls;
