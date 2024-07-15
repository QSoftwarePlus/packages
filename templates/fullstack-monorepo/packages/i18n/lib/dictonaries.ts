// import 'server-only'
import type { Locale } from '../i18n.config'
import * as en from '../dictionaries/en.json'
import * as es from '../dictionaries/es.json'

export type Dicc = typeof en | typeof es

const dictionaries = {
    en: () => import('../dictionaries/en.json').then(module => module.default),
    es: () => import('../dictionaries/es.json').then(module => module.default)
}

export const getDictionary = async (locale: Locale) => dictionaries[locale]()