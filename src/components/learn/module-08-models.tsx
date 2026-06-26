"use client";

import { ModuleShell, TheoryBlock, SandboxBlock, GoalBlock, ConceptChip, DefCard } from "@/components/learn/shell";
import { ACCENTS } from "@/components/learn/accents";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

type Model = {
  name: string;
  family: "BPE" | "WordPiece" | "Unigram" | "SentencePiece";
  vocabSize: string;
  notes: string;
  color: string;
};

const MODELS: Model[] = [
  {
    name: "GPT-2",
    family: "BPE",
    vocabSize: "50 257",
    notes: "Byte-level BPE — каждый байт Unicode может стать токеном. Покрывает любые языки и символы.",
    color: "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/40 dark:text-purple-200 dark:border-purple-700/60",
  },
  {
    name: "GPT-3 / GPT-3.5",
    family: "BPE",
    vocabSize: "50 257",
    notes: "Тот же токенизатор, что у GPT-2. Совместимы на уровне ID.",
    color: "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/40 dark:text-purple-200 dark:border-purple-700/60",
  },
  {
    name: "GPT-4",
    family: "BPE",
    vocabSize: "~100 000",
    notes: "Расширенный токенизатор cl100k_base. Лучше работает с кириллицей и редкими языками — на тех же текстах тратит меньше токенов, чем GPT-3.",
    color: "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/40 dark:text-purple-200 dark:border-purple-700/60",
  },
  {
    name: "Llama 2 / 3",
    family: "BPE",
    vocabSize: "32 000 / 128 000",
    notes: "BPE поверх SentencePiece. Llama 3 увеличила vocab до 128К для лучшей поддержки мультиязычности.",
    color: "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-300 dark:bg-fuchsia-900/40 dark:text-fuchsia-200 dark:border-fuchsia-700/60",
  },
  {
    name: "BERT-base",
    family: "WordPiece",
    vocabSize: "30 522",
    notes: "WordPiece на 30К токенов. Для мультиязычной версии — 119К (104 языка).",
    color: "bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-900/40 dark:text-rose-200 dark:border-rose-700/60",
  },
  {
    name: "DistilBERT",
    family: "WordPiece",
    vocabSize: "30 522",
    notes: "Использует тот же токенизатор, что и BERT-base (для совместимости).",
    color: "bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-900/40 dark:text-rose-200 dark:border-rose-700/60",
  },
  {
    name: "T5 / mT5",
    family: "Unigram",
    vocabSize: "32 128 / 250 112",
    notes: "SentencePiece с Unigram-моделью. Без пробелов как токенов — используется ▁ символ (underscore).",
    color: "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/40 dark:text-amber-200 dark:border-amber-700/60",
  },
  {
    name: "ALBERT",
    family: "Unigram",
    vocabSize: "30 000",
    notes: "SentencePiece с Unigram. Без ## префикса — использует другой синтаксис продолжений.",
    color: "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/40 dark:text-amber-200 dark:border-amber-700/60",
  },
  {
    name: "XLNet",
    family: "Unigram",
    vocabSize: "32 000",
    notes: "SentencePiece Unigram. Один из первых крупных переходов с WordPiece на Unigram.",
    color: "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/40 dark:text-amber-200 dark:border-amber-700/60",
  },
];

export function Module08Models() {
  const accent = ACCENTS[8];

  return (
    <ModuleShell
      id={8}
      title="Токенизация в больших моделях: GPT, BERT, Llama"
      subtitle="Каждое семейство моделей использует свой токенизатор. Знание этих различий помогает понимать, почему одна модель «видит» текст эффективнее другой."
      accent={accent}
    >
      <GoalBlock accent={accent}>
        запомнить, какой токенизатор у каких моделей и чем это обусловлено.
      </GoalBlock>

      <TheoryBlock accent={accent}>
        <p>
          На сегодняшний день в больших языковых моделях (LLM) доминируют
          три алгоритма подсловной токенизации: <strong>BPE</strong>,
          <strong> WordPiece</strong> и <strong>Unigram</strong>. Все три
          делают одно и то же (режут текст на подслова), но разными способами
          и с разными синтаксическими соглашениями.
        </p>
        <div className="grid sm:grid-cols-3 gap-3 not-prose">
          <DefCard
            accent={accent}
            term="BPE"
            definition="Итеративно сливает самые частые пары. Используется в OpenAI-семействе и Llama."
            example="GPT-2/3/4, Llama 2/3, ChatGPT"
          />
          <DefCard
            accent={accent}
            term="WordPiece"
            definition="Жадно разбирает слева направо, с ## префиксом. Используется в BERT-семействе."
            example="BERT, DistilBERT, Electra"
          />
          <DefCard
            accent={accent}
            term="Unigram"
            definition="Вероятностная модель: из большого набора кандидатов оставляет те, что максимизируют likelihood корпуса. Часто через SentencePiece."
            example="T5, ALBERT, XLNet"
          />
        </div>
        <p>
          Важный практический момент: <strong>разные модели по-разному
          «видят» один и тот же текст</strong>. Например, фраза «Привет, мир!»
          на русском в GPT-3 занимает 7 токенов, в GPT-4 — 4 токена, в Llama 3 —
          около 5. Это напрямую влияет на стоимость API (мы платим за токены)
          и на максимальную длину контекста.
        </p>
        <p>
          Ещё одна важная технология — <ConceptChip>SentencePiece</ConceptChip>.
          Это не отдельный алгоритм, а библиотека от Google, которая реализует
          и BPE, и Unigram, и char-level. Её фишка — работа напрямую с
          Unicode-строками без предварительного разбиения на слова по пробелам.
          Пробелы кодируются специальным символом <ConceptChip>▁</ConceptChip> (U+2581).
          Это решает проблему языков без пробелов (китайский, японский, тайский).
        </p>
      </TheoryBlock>

      <SandboxBlock accent={accent} title="Каталог токенизаторов популярных моделей">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {MODELS.map((m) => (
            <Card
              key={m.name}
              className="p-4 border-pink-200 dark:border-pink-800/60"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-semibold text-sm">{m.name}</h3>
                <Badge variant="outline" className="text-[10px] font-mono">
                  {m.family}
                </Badge>
              </div>
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                  vocab:
                </span>
                <span className={m.color + " font-mono text-xs px-1.5 py-0.5 rounded border"}>
                  {m.vocabSize}
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {m.notes}
              </p>
            </Card>
          ))}
        </div>
      </SandboxBlock>

      <SandboxBlock accent={accent} title="Сколько токенов в одной и той же фразе (приблизительно)">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-pink-200 dark:border-pink-800/60">
                <th className="text-left py-2 pr-3 font-semibold">Модель</th>
                <th className="text-left py-2 px-3 font-semibold">Фраза</th>
                <th className="text-right py-2 px-3 font-semibold">Токенов</th>
                <th className="text-right py-2 pl-3 font-semibold">$/1K токенов</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pink-100 dark:divide-pink-900/40">
              <Row model="GPT-3.5" phrase="Привет, мир! Как дела?" tokens={9} cost="$0.0015" />
              <Row model="GPT-4" phrase="Привет, мир! Как дела?" tokens={6} cost="$0.03" />
              <Row model="Llama 3" phrase="Привет, мир! Как дела?" tokens={7} cost="open" />
              <Row model="BERT" phrase="Привет, мир! Как дела?" tokens={10} cost="—" />
              <Row model="GPT-3.5" phrase="Tokenization is the first step." tokens={7} cost="$0.0015" />
              <Row model="GPT-4" phrase="Tokenization is the first step." tokens={6} cost="$0.03" />
              <Row model="Llama 3" phrase="Tokenization is the first step." tokens={7} cost="open" />
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground mt-2 italic">
          Числа — приблизительные, для иллюстрации. Реальное количество токенов
          зависит от конкретной версии токенизатора и может немного отличаться.
          Цены — на момент 2024 года, для понимания порядка величин.
        </p>
      </SandboxBlock>

      <div className="rounded-lg border border-pink-200 bg-pink-50 dark:border-pink-800/60 dark:bg-pink-950/40 p-4 text-sm">
        <div className="font-semibold text-pink-700 dark:text-pink-300 mb-2">
          Главные выводы
        </div>
        <ul className="space-y-1.5 text-foreground/90">
          <li className="flex gap-2">
            <Check className="h-4 w-4 text-pink-600 dark:text-pink-400 shrink-0 mt-0.5" />
            BPE доминирует в LLM (GPT, Llama) — он простой и эффективный.
          </li>
          <li className="flex gap-2">
            <Check className="h-4 w-4 text-pink-600 dark:text-pink-400 shrink-0 mt-0.5" />
            WordPiece живёт в BERT-семействе и его производных.
          </li>
          <li className="flex gap-2">
            <Check className="h-4 w-4 text-pink-600 dark:text-pink-400 shrink-0 mt-0.5" />
            Unigram — выбор T5, ALBERT, XLNet. Реализован через SentencePiece.
          </li>
          <li className="flex gap-2">
            <Check className="h-4 w-4 text-pink-600 dark:text-pink-400 shrink-0 mt-0.5" />
            Чем новее модель — тем больше vocab и тем меньше токенов на тот же текст.
          </li>
          <li className="flex gap-2">
            <Check className="h-4 w-4 text-pink-600 dark:text-pink-400 shrink-0 mt-0.5" />
            Цена API и длина контекста напрямую зависят от токенизатора.
          </li>
        </ul>
      </div>
    </ModuleShell>
  );
}

function Row({ model, phrase, tokens, cost }: { model: string; phrase: string; tokens: number; cost: string }) {
  return (
    <tr className="hover:bg-pink-50/50 dark:hover:bg-pink-950/30">
      <td className="py-2 pr-3 font-medium">{model}</td>
      <td className="py-2 px-3 font-mono text-xs text-muted-foreground">{phrase}</td>
      <td className="py-2 px-3 text-right font-mono">{tokens}</td>
      <td className="py-2 pl-3 text-right font-mono text-xs">{cost}</td>
    </tr>
  );
}
