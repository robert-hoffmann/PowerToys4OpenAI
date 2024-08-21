import { boot } from 'quasar/wrappers';

import i18next from 'i18next';
import I18NextVue from 'i18next-vue';
import LanguageDetector from 'i18next-browser-languagedetector';

import de from '../i18n/de';
import en from '../i18n/en';
import es from '../i18n/es';
import fr from '../i18n/fr';
import hi from '../i18n/hi';
import ja from '../i18n/ja';
import pt from '../i18n/pt';
import ru from '../i18n/ru';
import tr from '../i18n/tr';
import zh from '../i18n/zh';

// https://dev.to/adrai/how-to-properly-internationalize-a-vue-application-using-i18next-1doj
// usage in vue file: https://github.com/i18next/i18next-vue
export default boot(({ app }) => {
  i18next
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    debug      : false,
    fallbackLng: 'en',
    resources: {
      de: de,
      en: en,
      es: es,
      fr: fr,
      hi: hi,
      ja: ja,
      pt: pt,
      ru: ru,
      tr: tr,
      zh: zh
    },
    detection: {
      order: ['localStorage', 'navigator'],
    }
  });

  // Set i18n instance on app
  app.use(I18NextVue, { i18next })
});
