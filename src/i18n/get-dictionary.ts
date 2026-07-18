import type { Locale } from "@/types";
import ar from "./dictionaries/ar.json";
import en from "./dictionaries/en.json";

const dictionaries = {
  ar,
  en,
} as const;

export type Dictionary = typeof ar;

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale] as Dictionary;
}
