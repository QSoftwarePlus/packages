import * as En from './en.json'
import * as Ja from './ja.json'
import * as Es from './es.json'

export const translations = {
    en: En,
    es: Es,
    ja: Ja,
};

export type Translations = typeof translations;

type NestedKeyOf<ObjectType extends object> = {
    [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];


export type I18nKeys = NestedKeyOf<Translations['en']>;;