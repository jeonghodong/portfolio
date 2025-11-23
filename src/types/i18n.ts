/**
 * Internationalization Type Definitions
 * Types for multi-language support
 */

// Supported languages
export type Language = "ko" | "en";

// Localized string structure
export interface LocalizedString {
  ko: string;
  en: string;
}

// Generic localized content type
export type LocalizedContent<T> = {
  [K in keyof T]: T[K] extends string
    ? LocalizedString
    : T[K] extends string | undefined
    ? LocalizedString | undefined
    : T[K];
};

// Helper type to get localized field name
export type LocalizedFieldName<TBase extends string> = `${TBase}_ko` | `${TBase}_en`;

// Language context type
export interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (ko: string, en: string) => string;
}

// Translation function type
export type TranslationFunction = (ko: string, en: string) => string;

// Localized data helper
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithLocalization<T extends Record<string, any>> = T & {
  [K in keyof T as K extends string
    ? LocalizedFieldName<K>
    : never]: K extends keyof T ? T[K] : never;
};
