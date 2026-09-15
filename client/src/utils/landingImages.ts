import { SupportedLanguage } from '../types';
import heroShowcaseImg from '../assets/hero-showcase.png';
import superpoweredShowcaseImg from '../assets/superpowered-showcase.png';
import bentoShowcaseImg from '../assets/bento-showcase.png';

/**
 * Appends 4K Ultra-HD resolution (3840px width, 100% maximum quality)
 * parameters to ImageKit CDN assets.
 */
function to4kUrl(rawUrl: string): string {
  if (!rawUrl || !rawUrl.includes('ik.imagekit.io')) return rawUrl;
  // If already transformed, don't duplicate
  if (rawUrl.includes('tr=')) return rawUrl;
  const separator = rawUrl.includes('?') ? '&' : '?';
  return `${rawUrl}${separator}tr=w-3840,q-100`;
}

/**
 * Online Cloud CDN Image Assets for Landing Page across 6 languages,
 * automatically upscaled to 4K Ultra-HD.
 */
export const LANDING_IMAGES: {
  hero: Record<SupportedLanguage, string>;
  superpowered: Record<SupportedLanguage, string>;
  bento: Record<SupportedLanguage, string>;
} = {
  // 1st Showcase Picture: Hero Window (HeroScrollWindow.tsx)
  hero: {
    en: to4kUrl('https://ik.imagekit.io/AnubhavAkhil/SIH%202026/Image%201/Image_1_English.png?updatedAt=1789467345441'),
    hi: to4kUrl('https://ik.imagekit.io/AnubhavAkhil/SIH%202026/Image%201/Image_1_Hindi.png'),
    te: to4kUrl('https://ik.imagekit.io/AnubhavAkhil/SIH%202026/Image%201/Image_1_Telugu.png?updatedAt=1789467328066'),
    pa: to4kUrl('https://ik.imagekit.io/AnubhavAkhil/SIH%202026/Image%201/Image_1_Punjabi.png'),
    mr: to4kUrl('https://ik.imagekit.io/AnubhavAkhil/SIH%202026/Image%201/Image_1_Marathi.png'),
    bn: to4kUrl('https://ik.imagekit.io/AnubhavAkhil/SIH%202026/Image%201/Image_1_Bangla.png')
  },

  // 2nd Showcase Picture: Superpowered Cards Window (SuperpoweredCardsSection.tsx)
  superpowered: {
    en: to4kUrl('https://ik.imagekit.io/AnubhavAkhil/SIH%202026/Image%202/image_2_english.png'),
    hi: to4kUrl('https://ik.imagekit.io/AnubhavAkhil/SIH%202026/Image%202/image_2_hindi.png'),
    te: to4kUrl('https://ik.imagekit.io/AnubhavAkhil/SIH%202026/Image%202/image_2_telugu.png'),
    pa: to4kUrl('https://ik.imagekit.io/AnubhavAkhil/SIH%202026/Image%202/image_2_punjabi.png'),
    mr: to4kUrl('https://ik.imagekit.io/AnubhavAkhil/SIH%202026/Image%202/image_2_marathi.png'),
    bn: to4kUrl('https://ik.imagekit.io/AnubhavAkhil/SIH%202026/Image%202/image_2_bangla.png')
  },

  // 3rd Showcase Picture: Bento Showcase Window (BentoShowcase.tsx)
  bento: {
    en: to4kUrl('https://ik.imagekit.io/AnubhavAkhil/SIH%202026/Image%203/Image_03_english.png'),
    hi: to4kUrl('https://ik.imagekit.io/AnubhavAkhil/SIH%202026/Image%203/Image_03_hindi.png'),
    te: to4kUrl('https://ik.imagekit.io/AnubhavAkhil/SIH%202026/Image%203/Image_03_telugu.png'),
    pa: to4kUrl('https://ik.imagekit.io/AnubhavAkhil/SIH%202026/Image%203/Image_03_marathi.png'),
    mr: to4kUrl('https://ik.imagekit.io/AnubhavAkhil/SIH%202026/Image%203/Image_03_marathi.png'),
    bn: to4kUrl('https://ik.imagekit.io/AnubhavAkhil/SIH%202026/Image%203/Image_03_bangali.png')
  }
};

const LOCAL_FALLBACKS = {
  hero: heroShowcaseImg,
  superpowered: superpoweredShowcaseImg,
  bento: bentoShowcaseImg
};

/**
 * Helper function to retrieve the active 4K image with graceful fallback.
 */
export function getLandingImage(
  section: 'hero' | 'superpowered' | 'bento',
  lang: SupportedLanguage
): string {
  return LANDING_IMAGES[section]?.[lang] || LOCAL_FALLBACKS[section];
}

/**
 * Preloads all 4K landing images across all 6 languages into the browser's
 * HTTP and memory cache so language switching happens with 0ms latency.
 */
export function preloadAllLandingImages(): void {
  if (typeof window === 'undefined') return;

  const sections: Array<'hero' | 'superpowered' | 'bento'> = ['hero', 'superpowered', 'bento'];
  const languages: SupportedLanguage[] = ['en', 'hi', 'te', 'pa', 'mr', 'bn'];

  // Stagger preload so as not to choke the initial page rendering
  const schedulePreload = () => {
    languages.forEach((lang, lIdx) => {
      setTimeout(() => {
        sections.forEach((sec) => {
          const url = getLandingImage(sec, lang);
          if (url) {
            const img = new Image();
            img.decoding = 'async';
            img.src = url;
          }
        });
      }, lIdx * 60);
    });
  };

  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(schedulePreload, { timeout: 1200 });
  } else {
    setTimeout(schedulePreload, 300);
  }
}
