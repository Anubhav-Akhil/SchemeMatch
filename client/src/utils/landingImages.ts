import { SupportedLanguage } from '../types';
import heroShowcaseImg from '../assets/hero-showcase.png';
import superpoweredShowcaseImg from '../assets/superpowered-showcase.png';
import bentoShowcaseImg from '../assets/bento-showcase.png';

/**
 * Online Cloud CDN Image Assets for Landing Page across 6 languages.
 * Hosted on ImageKit CDN for optimal global loading speed.
 */
export const LANDING_IMAGES: {
  hero: Record<SupportedLanguage, string>;
  superpowered: Record<SupportedLanguage, string>;
  bento: Record<SupportedLanguage, string>;
} = {
  // 1st Showcase Picture: Hero Window (HeroScrollWindow.tsx)
  hero: {
    en: 'https://ik.imagekit.io/AnubhavAkhil/SIH%202026/Image%201/Image_1_English.png?updatedAt=1789467345441',
    hi: 'https://ik.imagekit.io/AnubhavAkhil/SIH%202026/Image%201/Image_1_Hindi.png',
    te: 'https://ik.imagekit.io/AnubhavAkhil/SIH%202026/Image%201/Image_1_Telugu.png?updatedAt=1789467328066',
    pa: 'https://ik.imagekit.io/AnubhavAkhil/SIH%202026/Image%201/Image_1_Punjabi.png',
    mr: 'https://ik.imagekit.io/AnubhavAkhil/SIH%202026/Image%201/Image_1_Marathi.png',
    bn: 'https://ik.imagekit.io/AnubhavAkhil/SIH%202026/Image%201/Image_1_Bangla.png'
  },

  // 2nd Showcase Picture: Superpowered Cards Window (SuperpoweredCardsSection.tsx)
  superpowered: {
    en: 'https://ik.imagekit.io/AnubhavAkhil/SIH%202026/Image%202/image_2_english.png',
    hi: 'https://ik.imagekit.io/AnubhavAkhil/SIH%202026/Image%202/image_2_hindi.png',
    te: 'https://ik.imagekit.io/AnubhavAkhil/SIH%202026/Image%202/image_2_telugu.png',
    pa: 'https://ik.imagekit.io/AnubhavAkhil/SIH%202026/Image%202/image_2_punjabi.png',
    mr: 'https://ik.imagekit.io/AnubhavAkhil/SIH%202026/Image%202/image_2_marathi.png',
    bn: 'https://ik.imagekit.io/AnubhavAkhil/SIH%202026/Image%202/image_2_bangla.png'
  },

  // 3rd Showcase Picture: Bento Showcase Window (BentoShowcase.tsx)
  bento: {
    en: 'https://ik.imagekit.io/AnubhavAkhil/SIH%202026/Image%203/Image_03_english.png',
    hi: 'https://ik.imagekit.io/AnubhavAkhil/SIH%202026/Image%203/Image_03_hindi.png',
    te: 'https://ik.imagekit.io/AnubhavAkhil/SIH%202026/Image%203/Image_03_telugu.png',
    pa: 'https://ik.imagekit.io/AnubhavAkhil/SIH%202026/Image%203/Image_03_marathi.png',
    mr: 'https://ik.imagekit.io/AnubhavAkhil/SIH%202026/Image%203/Image_03_marathi.png',
    bn: 'https://ik.imagekit.io/AnubhavAkhil/SIH%202026/Image%203/Image_03_bangali.png'
  }
};

const LOCAL_FALLBACKS = {
  hero: heroShowcaseImg,
  superpowered: superpoweredShowcaseImg,
  bento: bentoShowcaseImg
};

/**
 * Helper function to retrieve the active image with graceful fallback.
 */
export function getLandingImage(
  section: 'hero' | 'superpowered' | 'bento',
  lang: SupportedLanguage
): string {
  return LANDING_IMAGES[section]?.[lang] || LOCAL_FALLBACKS[section];
}
