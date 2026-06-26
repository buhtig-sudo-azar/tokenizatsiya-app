"use client";

import { ModuleShell, TheoryBlock, SandboxBlock, GoalBlock, DefCard, ConceptChip } from "@/components/learn/shell";
import { ACCENTS } from "@/components/learn/accents";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

const SPECIALS: Array<{
  token: string;
  family: "bpe" | "wordpiece";
  id: number;
  purpose: string;
  example: string;
}> = [
  {
    token: "<PAD>",
    family: "bpe",
    id: 0,
    purpose: "Заполнитель. Все последовательности в батче должны быть одинаковой длины — короткие добиваются <PAD>.",
    example: "«привет» → [привет, <PAD>, <PAD>] (длина батча = 3)",
  },
  {
    token: "<UNK>",
    family: "bpe",
    id: 1,
    purpose: "Неизвестный токен. Ставится, когда слова нет в словаре и его не удалось разобрать через subword.",
    example: "редкие emoji или неизвестные Unicode-символы",
  },
  {
    token: "<BOS>",
    family: "bpe",
    id: 2,
    purpose: "Beginning of sequence. Метка «здесь начинается текст». Помогает модели понять, где старт.",
    example: "T5, GPT-2: иногда явно добавляется в начало",
  },
  {
    token: "<EOS>",
    family: "bpe",
    id: 3,
    purpose: "End of sequence. Метка «здесь текст закончился». По ней модель останавливает генерацию.",
    example: "GPT генерирует токены, пока не выдаст <EOS>",
  },
  {
    token: "[CLS]",
    family: "wordpiece",
    id: 2,
    purpose: "Classification. В BERT ставится в начало — его финальный hidden state используется для классификации всего текста.",
    example: "[CLS] это спам? [SEP] → финальный вектор → классификатор",
  },
  {
    token: "[SEP]",
    family: "wordpiece",
    id: 3,
    purpose: "Separator. Разделяет два предложения в одной последовательности (например, для next-sentence prediction).",
    example: "[CLS] sentence A [SEP] sentence B [SEP]",
  },
  {
    token: "[MASK]",
    family: "wordpiece",
    id: 4,
    purpose: "Masked token. Заменяет случайные токены при обучении BERT — модель должна их предсказать (MLM задача).",
    example: "«модель [MASK] текст» → модель учится предсказать «читает»",
  },
];

export function Module06Special() {
  const accent = ACCENTS[6];

  return (
    <ModuleShell
      id={6}
      title="Специальные токены: PAD, UNK, BOS, EOS, CLS, SEP, MASK"
      subtitle="Кроме «настоящих» токенов из текста, в словаре есть служебные — они управляют батчами, генерацией и задачами модели."
      accent={accent}
    >
      <GoalBlock accent={accent}>
        запомнить назначение каждого спецтокена и понимать, зачем они занимают первые ID в словаре.
      </GoalBlock>

      <TheoryBlock accent={accent}>
        <p>
          Не все токены в словаре соответствуют реальным кускам текста. Часть
          токенов — <strong>служебные</strong>: они нужны для управления тем, как
          модель видит и обрабатывает последовательность. Эти токены обычно
          получают самые маленькие ID (0-5) и присутствуют в любом словаре.
        </p>
        <p>
          Зачем они нужны? Современные модели обучаются на <strong>батчах</strong> —
          наборах из нескольких примеров одновременно. Все примеры в батче
          должны быть одинаковой длины (иначе не сложить в матрицу). Короткие
          примеры добиваются токенами <ConceptChip>&lt;PAD&gt;</ConceptChip>. А чтобы
          модель знала, где начинается и заканчивается осмысленный текст,
          используются <ConceptChip>&lt;BOS&gt;</ConceptChip> и <ConceptChip>&lt;EOS&gt;</ConceptChip>.
        </p>
        <p>
          Стиль спецтокенов зависит от семейства модели:
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>BPE-семья</strong> (GPT, Llama): угловые скобки — <ConceptChip>&lt;PAD&gt;</ConceptChip> <ConceptChip>&lt;UNK&gt;</ConceptChip> <ConceptChip>&lt;BOS&gt;</ConceptChip> <ConceptChip>&lt;EOS&gt;</ConceptChip></li>
          <li><strong>WordPiece-семья</strong> (BERT): квадратные скобки — <ConceptChip>[CLS]</ConceptChip> <ConceptChip>[SEP]</ConceptChip> <ConceptChip>[MASK]</ConceptChip> <ConceptChip>[PAD]</ConceptChip> <ConceptChip>[UNK]</ConceptChip></li>
        </ul>
        <p>
          Эти спецтокены — не просто косметика. Они активно участвуют в
          обучении: например, в BERT 15% токенов случайно заменяются на
          <ConceptChip>[MASK]</ConceptChip>, и модель учится их предсказывать
          (это и есть masked language modeling, MLM). В GPT модель генерирует
          текст, пока не выдаст <ConceptChip>&lt;EOS&gt;</ConceptChip> — и по этому
          сигналу останавливается.
        </p>
      </TheoryBlock>

      <SandboxBlock accent={accent} title="Каталог спецтокенов">
        <div className="grid sm:grid-cols-2 gap-3">
          {SPECIALS.map((s) => (
            <Card
              key={s.token}
              className="p-4 border-teal-200 dark:border-teal-800/60"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <Badge
                  className={
                    s.family === "bpe"
                      ? "font-mono bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/40 dark:text-purple-200 dark:border-purple-700/60"
                      : "font-mono bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-900/40 dark:text-rose-200 dark:border-rose-700/60"
                  }
                >
                  {s.token}
                </Badge>
                <span className="text-xs font-mono text-muted-foreground">
                  ID: {s.id}
                </span>
              </div>
              <p className="text-sm text-foreground/90 leading-relaxed">
                {s.purpose}
              </p>
              <p className="text-xs text-muted-foreground mt-2 italic">
                Пример: {s.example}
              </p>
            </Card>
          ))}
        </div>
      </SandboxBlock>

      <SandboxBlock accent={accent} title="Как выглядит последовательность с спецтокенами">
        <div className="space-y-3">
          <div>
            <div className="text-xs uppercase tracking-wide text-teal-700 dark:text-teal-300 font-semibold mb-1.5">
              BERT (классификация предложения)
            </div>
            <div className="flex flex-wrap gap-1.5 font-mono text-sm">
              <span className="px-2 py-1 rounded border bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-900/40 dark:text-rose-200 dark:border-rose-700/60">[CLS]</span>
              <span className="px-2 py-1 rounded border bg-teal-100 text-teal-800 border-teal-300 dark:bg-teal-900/40 dark:text-teal-200 dark:border-teal-700/60">это</span>
              <span className="px-2 py-1 rounded border bg-teal-100 text-teal-800 border-teal-300 dark:bg-teal-900/40 dark:text-teal-200 dark:border-teal-700/60">спам</span>
              <span className="px-2 py-1 rounded border bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-900/40 dark:text-rose-200 dark:border-rose-700/60">[SEP]</span>
              <ArrowRight className="h-4 w-4 self-center text-muted-foreground" />
              <span className="text-xs text-muted-foreground self-center italic">финальный вектор [CLS] → классификатор «спам/не спам»</span>
            </div>
          </div>

          <div>
            <div className="text-xs uppercase tracking-wide text-teal-700 dark:text-teal-300 font-semibold mb-1.5">
              GPT (генерация текста)
            </div>
            <div className="flex flex-wrap gap-1.5 font-mono text-sm">
              <span className="px-2 py-1 rounded border bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/40 dark:text-purple-200 dark:border-purple-700/60">&lt;BOS&gt;</span>
              <span className="px-2 py-1 rounded border bg-teal-100 text-teal-800 border-teal-300 dark:bg-teal-900/40 dark:text-teal-200 dark:border-teal-700/60">однажды</span>
              <span className="px-2 py-1 rounded border bg-teal-100 text-teal-800 border-teal-300 dark:bg-teal-900/40 dark:text-teal-200 dark:border-teal-700/60">в</span>
              <span className="px-2 py-1 rounded border bg-teal-100 text-teal-800 border-teal-300 dark:bg-teal-900/40 dark:text-teal-200 dark:border-teal-700/60">сказке</span>
              <span className="px-2 py-1 rounded border bg-teal-100 text-teal-800 border-teal-300 dark:bg-teal-900/40 dark:text-teal-200 dark:border-teal-700/60">...</span>
              <span className="px-2 py-1 rounded border bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/40 dark:text-purple-200 dark:border-purple-700/60">&lt;EOS&gt;</span>
              <ArrowRight className="h-4 w-4 self-center text-muted-foreground" />
              <span className="text-xs text-muted-foreground self-center italic">остановка генерации</span>
            </div>
          </div>

          <div>
            <div className="text-xs uppercase tracking-wide text-teal-700 dark:text-teal-300 font-semibold mb-1.5">
              Батч из 2 предложений разной длины (с добивкой PAD)
            </div>
            <div className="space-y-1.5 font-mono text-sm">
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2 py-1 rounded border bg-teal-100 text-teal-800 border-teal-300 dark:bg-teal-900/40 dark:text-teal-200 dark:border-teal-700/60">привет</span>
                <span className="px-2 py-1 rounded border bg-teal-100 text-teal-800 border-teal-300 dark:bg-teal-900/40 dark:text-teal-200 dark:border-teal-700/60">мир</span>
                <span className="px-2 py-1 rounded border bg-gray-100 text-gray-500 border-gray-300 dark:bg-gray-900/40 dark:text-gray-400 dark:border-gray-700/60">&lt;PAD&gt;</span>
                <span className="px-2 py-1 rounded border bg-gray-100 text-gray-500 border-gray-300 dark:bg-gray-900/40 dark:text-gray-400 dark:border-gray-700/60">&lt;PAD&gt;</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2 py-1 rounded border bg-teal-100 text-teal-800 border-teal-300 dark:bg-teal-900/40 dark:text-teal-200 dark:border-teal-700/60">машинное</span>
                <span className="px-2 py-1 rounded border bg-teal-100 text-teal-800 border-teal-300 dark:bg-teal-900/40 dark:text-teal-200 dark:border-teal-700/60">обучение</span>
                <span className="px-2 py-1 rounded border bg-teal-100 text-teal-800 border-teal-300 dark:bg-teal-900/40 dark:text-teal-200 dark:border-teal-700/60">—</span>
                <span className="px-2 py-1 rounded border bg-teal-100 text-teal-800 border-teal-300 dark:bg-teal-900/40 dark:text-teal-200 dark:border-teal-700/60">это</span>
                <span className="px-2 py-1 rounded border bg-teal-100 text-teal-800 border-teal-300 dark:bg-teal-900/40 dark:text-teal-200 dark:border-teal-700/60">круто</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-teal-200 bg-teal-50 dark:border-teal-800/60 dark:bg-teal-950/40 p-3 text-sm">
            <div className="font-semibold text-teal-700 dark:text-teal-300 mb-1">
              Запомни главное
            </div>
            <ul className="space-y-1 text-foreground/90">
              <li>— <ConceptChip>&lt;PAD&gt;</ConceptChip> — добивка для равной длины в батче.</li>
              <li>— <ConceptChip>&lt;UNK&gt;</ConceptChip> — «я не знаю такого токена».</li>
              <li>— <ConceptChip>&lt;BOS&gt;</ConceptChip> / <ConceptChip>&lt;EOS&gt;</ConceptChip> — начало и конец текста.</li>
              <li>— <ConceptChip>[CLS]</ConceptChip> — «классифицируй через этот вектор» (BERT).</li>
              <li>— <ConceptChip>[SEP]</ConceptChip> — «разделитель предложений» (BERT).</li>
              <li>— <ConceptChip>[MASK]</ConceptChip> — «угадай, что было здесь» (MLM в BERT).</li>
            </ul>
          </div>
        </div>
      </SandboxBlock>
    </ModuleShell>
  );
}
