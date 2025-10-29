import { Chapter, EpubData } from '../types';

declare const JSZip: any;

function extractTextFromHtml(htmlString: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const blocks = doc.body.querySelectorAll('p, h1, h2, h3, h4, h5, h6, div, blockquote, li');
    if (blocks.length > 0) {
        return Array.from(blocks).map(block => block.textContent?.trim() || '').join('\n\n');
    }
    return doc.body.textContent?.trim() || '';
}

function createPatternRegex(pattern: string): RegExp | null {
    if (!pattern.includes('*')) return null;
    const escapedPattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regexPattern = `^${escapedPattern.replace(/\\\*/g, '.+')}$`;
    return new RegExp(regexPattern, 'i');
}


export async function parseEpub(file: File, manualPattern?: string): Promise<EpubData> {
    const zip = await JSZip.loadAsync(file);
    const parser = new DOMParser();

    // 1. Find OPF file path from container.xml
    const containerXmlText = await zip.file('META-INF/container.xml').async('string');
    const containerDoc = parser.parseFromString(containerXmlText, 'application/xml');
    const opfPath = containerDoc.getElementsByTagName('rootfile')[0]?.getAttribute('full-path');
    if (!opfPath) throw new Error('Could not find OPF file path in container.xml');
    
    const basePath = opfPath.substring(0, opfPath.lastIndexOf('/') + 1);

    // 2. Find TOC file path from OPF file
    const opfText = await zip.file(opfPath).async('string');
    const opfDoc = parser.parseFromString(opfText, 'application/xml');

    const manifestItems = opfDoc.getElementsByTagName('item');
    let tocId: string | null = null;
    
    // Try to find nav properties first (EPUB 3)
    let tocPath: string | null = null;
    for (const item of Array.from(manifestItems)) {
        if (item.getAttribute('properties')?.includes('nav')) {
            tocPath = item.getAttribute('href');
            break;
        }
    }
    
    // Fallback to spine toc (EPUB 2)
    if (!tocPath) {
        tocId = opfDoc.getElementsByTagName('spine')[0]?.getAttribute('toc');
        if (!tocId) throw new Error('Could not find TOC reference in OPF file');
        
        const tocItem = opfDoc.querySelector(`item[id="${tocId}"]`);
        tocPath = tocItem?.getAttribute('href');
    }

    if (!tocPath) throw new Error('Could not find TOC file path in OPF file');

    // 3. Parse TOC file for chapters
    const tocFullPath = basePath + tocPath;
    const tocText = await zip.file(tocFullPath).async('string');
    const tocDoc = parser.parseFromString(tocText, 'application/xml');

    let rawChapters: { title: string; href: string }[] = [];

    // EPUB 3 Nav document (XHTML)
    if (tocDoc.querySelector('nav[epub\\:type="toc"]')) {
        const links = tocDoc.querySelectorAll('nav[epub\\:type="toc"] ol li a');
        links.forEach(link => {
            const title = link.textContent?.trim();
            const href = link.getAttribute('href')?.split('#')[0];
            if (title && href) {
                rawChapters.push({ title, href });
            }
        });
    } 
    // EPUB 2 NCX
    else {
        const navPoints = tocDoc.getElementsByTagName('navPoint');
        Array.from(navPoints).forEach(point => {
            const title = point.getElementsByTagName('navLabel')[0]?.textContent?.trim();
            const href = point.getElementsByTagName('content')[0]?.getAttribute('src')?.split('#')[0];
            if (title && href) {
                rawChapters.push({ title, href });
            }
        });
    }

    if (rawChapters.length === 0) {
        throw new Error("Could not find any chapters. Try using a manual pattern.");
    }

    const patternRegex = manualPattern ? createPatternRegex(manualPattern) : null;
    const chapters: Chapter[] = rawChapters
        .map((ch, index) => ({ ...ch, id: index + 1 }))
        .filter(ch => {
            if (!patternRegex) return true;
            return patternRegex.test(ch.title);
        });

     if (chapters.length === 0 && patternRegex) {
        throw new Error("Manual pattern did not match any chapters.");
    }

    const getChapterContent = async (chapter: Chapter): Promise<string> => {
        const chapterFullPath = basePath + chapter.href;
        if (!zip.file(chapterFullPath)) {
            console.error(`File not found in epub: ${chapterFullPath}`);
            return `Error: Could not load content for "${chapter.title}".`;
        }
        const chapterHtml = await zip.file(chapterFullPath).async('string');
        return extractTextFromHtml(chapterHtml);
    };

    return { chapters, getChapterContent };
}
