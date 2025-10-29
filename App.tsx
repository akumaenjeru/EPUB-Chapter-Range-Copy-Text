import React, { useState, useEffect, useCallback } from 'react';
import { Chapter, ChapterGroup, EpubData } from './types';
import { parseEpub } from './services/epubParser';
import FileUpload from './components/FileUpload';
import Controls from './components/Controls';
import ChapterList from './components/ChapterList';
import { InstallIcon } from './components/Icons';

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [epubData, setEpubData] = useState<EpubData | null>(null);
  const [groupedChapters, setGroupedChapters] = useState<ChapterGroup[]>([]);
  const [groupingSize, setGroupingSize] = useState<number>(1);
  const [manualPattern, setManualPattern] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const [copyingGroupId, setCopyingGroupId] = useState<string | null>(null);
  const [copiedGroupId, setCopiedGroupId] = useState<string | null>(null);

  const [installPrompt, setInstallPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = () => {
    if (!installPrompt) {
      return;
    }
    installPrompt.prompt();
    installPrompt.userChoice.then((choiceResult: { outcome: string }) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }
      setInstallPrompt(null);
    });
  };

  const handleParseEpub = useCallback(async (currentFile: File, pattern?: string) => {
    setIsLoading(true);
    setError(null);
    setEpubData(null);
    setGroupedChapters([]);
    try {
      const data = await parseEpub(currentFile, pattern);
      setEpubData(data);
    } catch (err: any) {
      setError(err.message || 'Failed to parse EPUB file.');
      setEpubData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    handleParseEpub(selectedFile);
  };

  const handlePatternUpdate = () => {
    if (file) {
      handleParseEpub(file, manualPattern);
    }
  };

  useEffect(() => {
    if (!epubData || groupingSize <= 0) {
      setGroupedChapters([]);
      return;
    }

    const groups: ChapterGroup[] = [];
    for (let i = 0; i < epubData.chapters.length; i += groupingSize) {
      const chunk = epubData.chapters.slice(i, i + groupingSize);
      if (chunk.length > 0) {
        const startChapter = chunk[0];
        const endChapter = chunk[chunk.length - 1];
        groups.push({
          id: `${startChapter.id}-${endChapter.id}`,
          startChapter,
          endChapter,
          chapters: chunk,
        });
      }
    }
    setGroupedChapters(groups);
  }, [epubData, groupingSize]);

  const handleCopy = async (group: ChapterGroup) => {
    if (!epubData || copyingGroupId) return;
    setCopyingGroupId(group.id);
    setCopiedGroupId(null);
    try {
      const contentPromises = group.chapters.map(ch => epubData.getChapterContent(ch));
      const contents = await Promise.all(contentPromises);
      const fullText = contents.join('\n\n---\n\n');
      await navigator.clipboard.writeText(fullText);
      setCopiedGroupId(group.id);
      setTimeout(() => setCopiedGroupId(null), 2500);
    } catch (err) {
      setError('Failed to copy content.');
    } finally {
      setCopyingGroupId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex justify-center items-center gap-4 mb-2 flex-wrap">
            <h1 className="text-3xl sm:text-4xl font-bold text-white">EPUB Chapter Exporter</h1>
            {installPrompt && (
              <button
                onClick={handleInstallClick}
                className="bg-green-600 text-white font-semibold py-2 px-3 rounded-md hover:bg-green-500 transition-colors duration-300 flex items-center justify-center text-sm"
                aria-label="Install App"
              >
                <InstallIcon />
                <span className="hidden sm:inline">Install App</span>
                <span className="sm:hidden">Install</span>
              </button>
            )}
          </div>
          <p className="text-lg text-gray-400">Upload, group, and copy chapter content from your EPUB files.</p>
        </header>
        
        <main className="space-y-6">
          {error && (
            <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-md relative" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {!epubData && (
             <FileUpload onFileSelect={handleFileSelect} isLoading={isLoading} />
          )}

          {epubData && (
            <>
               <Controls
                groupingSize={groupingSize}
                setGroupingSize={setGroupingSize}
                manualPattern={manualPattern}
                setManualPattern={setManualPattern}
                onPatternUpdate={handlePatternUpdate}
                isLoading={isLoading}
              />
              <ChapterList
                groupedChapters={groupedChapters}
                onCopy={handleCopy}
                copyingGroupId={copyingGroupId}
                copiedGroupId={copiedGroupId}
              />
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;