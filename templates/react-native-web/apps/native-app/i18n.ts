import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';
import { translations, I18nKeys } from 'i18n';

const i18n = new I18n(translations);

const locales = getLocales();
i18n.locale = locales[0]?.languageCode ?? 'en';
i18n.enableFallback = true;

const { t, ...rest } = i18n;

const typedI18n = {
    t: (key: I18nKeys) => i18n.t(key),
    locale: i18n.locale,
    ...rest,
};

export default typedI18n;