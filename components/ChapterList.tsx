import React from 'react';
import { ChapterGroup } from '../types';
import { CopyIcon, CheckIcon, SpinnerIcon } from './Icons';

interface ChapterListProps {
  groupedChapters: ChapterGroup[];
  onCopy: (group: ChapterGroup) => void;
  copyingGroupId: string | null;
  copiedGroupId: string | null;
}

const ChapterList: React.FC<ChapterListProps> = ({
  groupedChapters,
  onCopy,
  copyingGroupId,
  copiedGroupId,
}) => {
  if (groupedChapters.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No chapters found or file not yet processed.
      </div>
    );
  }

  const getGroupTitle = (group: ChapterGroup) => {
    const startNum = group.startChapter.id;
    const endNum = group.endChapter.id;

    if (startNum === endNum) {
      return `${group.startChapter.title} (${startNum})`;
    }
    return `${group.startChapter.title} - ${group.endChapter.title} (${startNum}-${endNum})`;
  };

  return (
    <div className="w-full space-y-3">
      <h2 className="text-xl font-bold text-gray-200">Chapter Groups</h2>
      <ul className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        {groupedChapters.map((group, index) => (
          <li key={group.id} className={`p-4 flex justify-between items-center ${index < groupedChapters.length - 1 ? 'border-b border-gray-700' : ''}`}>
            <span className="flex-1 text-gray-300 truncate pr-4" title={getGroupTitle(group)}>
              {getGroupTitle(group)}
            </span>
            <button
              onClick={() => onCopy(group)}
              disabled={!!copyingGroupId}
              className="flex items-center justify-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 bg-gray-700 text-gray-200 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-wait"
            >
              {copyingGroupId === group.id ? (
                <>
                  <SpinnerIcon /> Copying
                </>
              ) : copiedGroupId === group.id ? (
                <>
                  <CheckIcon /> Copied
                </>
              ) : (
                <>
                  <CopyIcon /> Copy
                </>
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChapterList;
