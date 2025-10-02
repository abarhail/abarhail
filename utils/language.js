// utils/language.js
import { siteConfig } from '../config/site';

export const detectLanguage = (req) => {
  if (req?.query?.lang && ['ar', 'en'].includes(req.query.lang)) return req.query.lang;
  if (req?.headers?.['accept-language']) {
    const lang = req.headers['accept-language'].split(',')[0].split('-')[0];
    if (['ar', 'en'].includes(lang)) return lang;
  }
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('preferred-language');
    if (saved && ['ar', 'en'].includes(saved)) return saved;
    const browserLang = navigator.language.split('-')[0];
    if (['ar', 'en'].includes(browserLang)) return browserLang;
  }
  return 'ar';
};

export const getLanguageFromPath = (path) => {
  const arPaths = Object.values(siteConfig.urls.ar);
  return arPaths.some((p) => path.startsWith(p)) ? 'ar' : 'en';
};

export const isRTL = (lang) => lang === 'ar';

export const switchLanguage = (currentLang, currentPath, router) => {
  const newLang = currentLang === "ar" ? "en" : "ar";
  const { ar, en } = siteConfig.urls;

  let matchedKey = null;

  // 1. Iterate keys but check home last
  const keys = Object.keys(ar).filter((k) => k !== "home");
  keys.push("home"); // ensure home is checked last

  for (const key of keys) {
    if (
      currentPath === ar[key] ||
      currentPath.startsWith(ar[key] + "/") ||
      currentPath.startsWith(ar[key] + "?")
    ) {
      matchedKey = key;
      break;
    }
    if (
      currentPath === en[key] ||
      currentPath.startsWith(en[key] + "/") ||
      currentPath.startsWith(en[key] + "?")
    ) {
      matchedKey = key;
      break;
    }
  }

  // 2. Build new path
  let newPath;
  if (matchedKey) {
    const fromPath = siteConfig.urls[currentLang][matchedKey];
    const toPath = siteConfig.urls[newLang][matchedKey];
    newPath = currentPath.replace(fromPath, toPath);
  } else {
    newPath = siteConfig.urls[newLang].home;
  }

  // 3. Save preference
  if (typeof window !== "undefined") {
    localStorage.setItem("preferred-language", newLang);
  }

  // 4. Force reload
  if (typeof window !== "undefined") {
    window.location.href = newPath;
  } else {
    router.replace(newPath);
  }
};
