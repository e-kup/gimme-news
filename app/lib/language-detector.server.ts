import LanguageDetect from 'languagedetect';

const lngDetector = new LanguageDetect();

export const isEnglish = (text: string): boolean => {
  try {
    const probabilities = lngDetector.detect(text, 1);
    const [lang] = probabilities?.[0] || [];
    return lang === 'english';
  } catch (e) {
    console.log(e);
  }
  return false;
};
