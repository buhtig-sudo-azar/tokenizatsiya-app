import type { Accent } from "@/components/learn/shell";

/**
 * Палитра акцентов для 9 модулей о токенизации.
 * Избегаем blue/indigo (по правилам fullstack-dev).
 *
 * Палитра подобрана так, чтобы каждый модуль имел свой узнаваемый цвет,
 * но все цвета лежат в тёплой/пурпурной части спектра — чтобы
 * визуально отличать приложение о токенизации от материнского ml-s-nula
 * (где dominates бирюза).
 */
export const ACCENTS: Record<number, Accent> = {
  1: {
    text: "text-purple-700 dark:text-purple-300",
    bg: "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-200",
    bgSoft: "bg-purple-50 dark:bg-purple-950/40",
    border: "border-purple-200 dark:border-purple-800/60",
    ring: "ring-purple-300 dark:ring-purple-700",
    chip: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/50 dark:text-purple-200 dark:border-purple-800/60",
  },
  2: {
    text: "text-fuchsia-700 dark:text-fuchsia-300",
    bg: "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/50 dark:text-fuchsia-200",
    bgSoft: "bg-fuchsia-50 dark:bg-fuchsia-950/40",
    border: "border-fuchsia-200 dark:border-fuchsia-800/60",
    ring: "ring-fuchsia-300 dark:ring-fuchsia-700",
    chip: "bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200 dark:bg-fuchsia-900/50 dark:text-fuchsia-200 dark:border-fuchsia-800/60",
  },
  3: {
    text: "text-rose-700 dark:text-rose-300",
    bg: "bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-200",
    bgSoft: "bg-rose-50 dark:bg-rose-950/40",
    border: "border-rose-200 dark:border-rose-800/60",
    ring: "ring-rose-300 dark:ring-rose-700",
    chip: "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/50 dark:text-rose-200 dark:border-rose-800/60",
  },
  4: {
    text: "text-amber-700 dark:text-amber-300",
    bg: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-200",
    bgSoft: "bg-amber-50 dark:bg-amber-950/40",
    border: "border-amber-200 dark:border-amber-800/60",
    ring: "ring-amber-300 dark:ring-amber-700",
    chip: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/50 dark:text-amber-200 dark:border-amber-800/60",
  },
  5: {
    text: "text-orange-700 dark:text-orange-300",
    bg: "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-200",
    bgSoft: "bg-orange-50 dark:bg-orange-950/40",
    border: "border-orange-200 dark:border-orange-800/60",
    ring: "ring-orange-300 dark:ring-orange-700",
    chip: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/50 dark:text-orange-200 dark:border-orange-800/60",
  },
  6: {
    text: "text-teal-700 dark:text-teal-300",
    bg: "bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-200",
    bgSoft: "bg-teal-50 dark:bg-teal-950/40",
    border: "border-teal-200 dark:border-teal-800/60",
    ring: "ring-teal-300 dark:ring-teal-700",
    chip: "bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-900/50 dark:text-teal-200 dark:border-teal-800/60",
  },
  7: {
    text: "text-emerald-700 dark:text-emerald-300",
    bg: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-200",
    bgSoft: "bg-emerald-50 dark:bg-emerald-950/40",
    border: "border-emerald-200 dark:border-emerald-800/60",
    ring: "ring-emerald-300 dark:ring-emerald-700",
    chip: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-200 dark:border-emerald-800/60",
  },
  8: {
    text: "text-pink-700 dark:text-pink-300",
    bg: "bg-pink-100 text-pink-700 dark:bg-pink-900/50 dark:text-pink-200",
    bgSoft: "bg-pink-50 dark:bg-pink-950/40",
    border: "border-pink-200 dark:border-pink-800/60",
    ring: "ring-pink-300 dark:ring-pink-700",
    chip: "bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-900/50 dark:text-pink-200 dark:border-pink-800/60",
  },
  9: {
    text: "text-red-700 dark:text-red-300",
    bg: "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-200",
    bgSoft: "bg-red-50 dark:bg-red-950/40",
    border: "border-red-200 dark:border-red-800/60",
    ring: "ring-red-300 dark:ring-red-700",
    chip: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/50 dark:text-red-200 dark:border-red-800/60",
  },
};

export const MODULE_META: Array<{
  id: number;
  short: string;
  title: string;
}> = [
  { id: 1, short: "Введение", title: "Что такое токенизация" },
  { id: 2, short: "Уровни", title: "Уровни токенизации" },
  { id: 3, short: "Словарь", title: "Словарь и ID токенов" },
  { id: 4, short: "BPE", title: "Byte Pair Encoding" },
  { id: 5, short: "WordPiece", title: "WordPiece" },
  { id: 6, short: "Спецтокены", title: "Специальные токены" },
  { id: 7, short: "Песочница", title: "Попробуй сам" },
  { id: 8, short: "Модели", title: "Токенизация в больших моделях" },
  { id: 9, short: "Дальше", title: "Что изучать дальше" },
];
