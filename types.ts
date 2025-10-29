export interface Chapter {
  id: number;
  title: string;
  href: string;
}

export interface ChapterGroup {
  id: string;
  startChapter: Chapter;
  endChapter: Chapter;
  chapters: Chapter[];
}

export interface EpubData {
  chapters: Chapter[];
  getChapterContent: (chapter: Chapter) => Promise<string>;
}
