# Токенизация — как машины читают текст

Интерактивное приложение: разберитесь, как текст превращается в токены
и числа, которыми оперируют языковые модели (GPT, BERT, Llama).
**9 модулей с живой песочницей BPE и WordPiece.**

> Это приложение — продолжение курса [«ML с нуля»](https://ml-s-nula.vercel.app/).

## Возможности

- **9 интерактивных модулей** с живыми песочницами на React + TypeScript
- **Живой BPE по шагам** — посмотри, как символы сливаются в подслова
- **Живой WordPiece** — жадный разбор слева направо с ## префиксом
- **Главная песочница** — 4 токенизатора на одном тексте
- **Прогресс сохраняется** локально в `localStorage`
- **Светлая/тёмная тема** с переключателем
- **Адаптивный дизайн** — мобильные и десктопы
- **Доступность**: keyboard-friendly, `aria-label`, `prefers-reduced-motion`

## Модули

1. Что такое токенизация — и зачем она нужна
2. Уровни токенизации: слова, символы, подслова
3. Словарь и ID токенов
4. BPE — Byte Pair Encoding (GPT)
5. WordPiece (BERT)
6. Специальные токены: PAD, UNK, BOS, EOS, CLS, SEP, MASK
7. Песочница: попробуй токенизировать свой текст
8. Токенизация в больших моделях: GPT, BERT, Llama
9. Что изучать дальше — roadmap

## Технологии

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS 4** + **shadcn/ui**
- **lucide-react** для иконок

## Локальный запуск

```bash
bun install
bun run dev     # http://localhost:3000
bun run lint    # проверка кода
```

## Структура проекта

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx            # Hero + 9 модулей
│   └── globals.css
├── components/
│   ├── learn/
│   │   ├── theme-toggle.tsx
│   │   ├── scroll-to-top.tsx
│   │   ├── shell.tsx       # Обёртка модуля
│   │   ├── accents.ts      # Цвета модулей
│   │   ├── module-01-intro.tsx … module-09-next.tsx
│   └── ui/                 # shadcn/ui
└── lib/
    ├── tokenizer.ts        # word / char / BPE / WordPiece реализации
    ├── use-progress.tsx
    ├── use-local-storage.ts
    └── utils.ts
```

## Создатель

**создатель AZAR**

## Лицензия

Свободно для обучения и некоммерческого использования.
