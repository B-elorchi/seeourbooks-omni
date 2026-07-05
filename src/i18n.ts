import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "app_name": "SeeOurBook",
      "login": "Log in",
      "signup": "Sign up",
      "dashboard": "Dashboard",
      "ai_process": "AI Process",
      "my_library": "My Library",
      "logout": "Logout",
      "free_trial": "Free Trial",
      "user": "User",
      "switch_lang": "عربي"
    }
  },
  ar: {
    translation: {
      "app_name": "SeeOurBook",
      "login": "تسجيل الدخول",
      "signup": "إنشاء حساب",
      "dashboard": "لوحة التحكم",
      "ai_process": "المعالجة بالذكاء الاصطناعي",
      "my_library": "مكتبتي",
      "logout": "تسجيل الخروج",
      "free_trial": "تجربة مجانية",
      "user": "مستخدم",
      "switch_lang": "English"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;
