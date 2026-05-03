const IMG_REGEX = /!\[([^\]]*)\]\(([^)]+)\)/g;

interface ExtractedImage { src: string; alt: string; }

export function extractImages(markdown: string): { images: ExtractedImage[]; text: string } {
  const images: ExtractedImage[] = [];
  const text = markdown.replace(IMG_REGEX, (_match, alt, src) => {
    images.push({ src, alt: alt || '' });
    return '';
  });
  return { images, text: text.trim() };
}
