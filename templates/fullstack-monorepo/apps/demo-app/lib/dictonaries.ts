// import 'server-only'
import { en, es, Locale } from '@repo/i18n'

export type Dicc = typeof en | typeof es

const dictionaries = {
    en: () => import('@repo/i18n/dictionaries/en.json').then(module => module.default),
    es: () => import('@repo/i18n/dictionaries/es.json').then(module => module.default)
}

export const getDictionary = async (locale: Locale) => dictionaries[locale]()