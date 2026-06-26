"use client";

import { useState } from "react";
import { ModuleShell, TheoryBlock, SandboxBlock, GoalBlock, ConceptChip } from "@/components/learn/shell";
import { ACCENTS } from "@/components/learn/accents";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ArrowRight, Repeat } from "lucide-react";

// Учебный набор обучающих "merge" правил — как если бы мы обучили BPE на корпусе.
// Порядок = приоритет: верхние применяются раньше.
const TRAINING_MERGES: Array<{ pair: [string, string]; merged: string }> = [
  { pair: ["т", "о"], merged: "то" },
  { pair: ["то", "к"], merged: "ток" },
  { pair: ["ток", "е"], merged: "токе" },
  { pair: ["токе", "н"], merged: "токен" },
  { pair: ["и", "з"], merged: "из" },
  { pair: ["из", "а"], merged: "иза" },
  { pair: ["иза", "ц"], merged: "изаци" },
  { pair: ["изаци", "я"], merged: "изация" },
  { pair: ["п", "р"], merged: "пр" },
  { pair: ["пр", "и"], merged: "при" },
  { pair: ["при", "в"], merged: "прив" },
  { pair: ["прив", "е"], merged: "приве" },
  { pair: ["приве", "т"], merged: "привет" },
];

type Step = {
  symbols: string[];
  appliedMerge?: { pair: [string, string]; merged: string };
  description: string;
};

function buildSteps(word: string): Step[] {
  const steps: Step[] = [];
  let symbols = Array.from(word);
  steps.push({
    symbols: [...symbols],
    description: `Старт: разбиваем слово «${word}» на отдельные символы.`,
  });

  let changed = true;
  while (symbols.length > 1 && changed) {
    changed = false;
    for (const merge of TRAINING_MERGES) {
      const [a, b] = merge.pair;
      let found = false;
      for (let i = 0; i < symbols.length - 1; i++) {
        if (symbols[i] === a && symbols[i + 1] === b) {
          symbols = [...symbols.slice(0, i), merge.merged, ...symbols.slice(i + 2)];
          steps.push({
            symbols: [...symbols],
            appliedMerge: merge,
            description: `Применяем merge: «${a}» + «${b}» → «${merge.merged}».`,
          });
          changed = true;
          found = true;
          break;
        }
      }
      if (found) break;
    }
  }

  if (symbols.length === 1 && symbols[0] === word) {
    steps.push({
      symbols: [...symbols],
      description: `Готово: слово целиком собрано в один токен «${symbols[0]}».`,
    });
  } else if (symbols.length === 1) {
    steps.push({
      symbols: [...symbols],
      description: `Готово: осталось одно подслово «${symbols[0]}» (возможно, с неизвестной частью).`,
    });
  } else {
    steps.push({
      symbols: [...symbols],
      description: `Готово: дальнейших merges нет. Получили ${symbols.length} подслов.`,
    });
  }
  return steps;
}

const PRESETS = ["токенизация", "привет", "токен"];

export function Module04Bpe() {
  const accent = ACCENTS[4];
  const [word, setWord] = useState("токенизация");
  const [stepIdx, setStepIdx] = useState(0);

  const safeWord = word.trim() || "токенизация";
  const steps = buildSteps(safeWord);
  const clampedIdx = Math.min(stepIdx, steps.length - 1);
  const currentStep = steps[clampedIdx];

  function reset(newWord?: string) {
    if (newWord !== undefined) setWord(newWord);
    setStepIdx(0);
  }

  return (
    <ModuleShell
      id={4}
      title="BPE — Byte Pair Encoding: как GPT режет слова"
      subtitle="BPE — самый популярный алгоритм подсловной токенизации. Его используют GPT-2, GPT-4, Llama, ChatGPT. Разберёмся, как он работает — шаг за шагом."
      accent={accent}
    >
      <GoalBlock accent={accent}>
        увидеть, как BPE постепенно сливает пары символов в подслова, применяя заранее обученные правила.
      </GoalBlock>

      <TheoryBlock accent={accent}>
        <p>
          BPE придуман ещё в 1994 году для сжатия данных, а в NLP его
          адаптировала статья Sennrich &amp; Haddow &amp; Birch (2015). Идея
          простая: <strong>начать с отдельных символов и постепенно сливать
          самые частые пары</strong>, пока не достигнем нужного размера словаря.
        </p>
        <p>
          Алгоритм состоит из двух фаз — обучения (<em>training</em>) и применения
          (<em>encoding</em>):
        </p>
        <ol className="list-decimal list-inside space-y-1.5">
          <li>
            <strong>Training.</strong> Берём большой корпус, разбиваем все слова
            на символы. Считаем, какая пара соседних символов встречается чаще
            всего. Добавляем её в список merges и заменяем во всём корпусе.
            Повторяем, пока vocab не достигнет нужного размера.
          </li>
          <li>
            <strong>Encoding.</strong> Когда приходит новый текст, каждое слово
            разбивается на символы и к нему применяются merges по порядку
            (от самых ранних к поздним). Получаем финальную последовательность
            подслов.
          </li>
        </ol>
        <p>
          Главная фишка BPE: <strong>любое слово можно разобрать</strong>. Если
          слова нет в словаре целиком — оно разбивается на подслова. Если и
          подслов нет — на отдельные символы. Поэтому <ConceptChip>&lt;UNK&gt;</ConceptChip> в
          BPE встречается крайне редко (обычно только для неизвестных Unicode-символов).
        </p>
        <p>
          Именно BPE лежит в основе токенизаторов GPT-2 (vocab 50 257), GPT-Neo,
          Llama 2/3 (vocab 32 000), и в слегка модифицированном виде — GPT-4
          (vocab ~100 000, с поддержкой byte-level).
        </p>
      </TheoryBlock>

      <SandboxBlock accent={accent} title="BPE по шагам: введи слово и листай шаги">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">
              Слово для токенизации
            </label>
            <div className="flex gap-2 mt-1">
              <Input
                value={word}
                onChange={(e) => reset(e.target.value.toLowerCase())}
                placeholder="например: токенизация"
                className="font-mono"
              />
              <Button variant="outline" size="sm" onClick={() => reset()}>
                <Repeat className="h-3.5 w-3.5 mr-1" />
                Сброс
              </Button>
            </div>
            <div className="flex gap-1.5 mt-2 flex-wrap">
              {PRESETS.map((p) => (
                <Button
                  key={p}
                  variant="ghost"
                  size="sm"
                  className="text-xs h-7"
                  onClick={() => reset(p)}
                >
                  {p}
                </Button>
              ))}
            </div>
          </div>

          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">
                Шаг {clampedIdx + 1} / {steps.length}
              </span>
              <div className="flex gap-1.5">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={clampedIdx === 0}
                  onClick={() => setStepIdx(Math.max(0, clampedIdx - 1))}
                >
                  ← Назад
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={clampedIdx === steps.length - 1}
                  onClick={() => setStepIdx(Math.min(steps.length - 1, clampedIdx + 1))}
                >
                  Вперёд →
                </Button>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-3 min-h-[2.5rem]">
              {currentStep.description}
            </p>

            {/* Текущее состояние символов */}
            <div className="flex flex-wrap items-center gap-1.5 py-3 rounded-lg bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 p-3">
              {currentStep.symbols.map((s, i) => (
                <span key={i} className="flex items-center">
                  <span className="px-2 py-1 rounded border border-amber-300 bg-amber-100 text-amber-800 font-mono text-sm dark:bg-amber-900/50 dark:text-amber-200 dark:border-amber-700/60">
                    {s}
                  </span>
                  {i < currentStep.symbols.length - 1 && (
                    <ArrowRight className="h-3 w-3 mx-0.5 text-muted-foreground/50" />
                  )}
                </span>
              ))}
            </div>

            {/* Применённое правило */}
            {currentStep.appliedMerge && (
              <div className="mt-3 text-xs font-mono flex items-center gap-2 text-amber-700 dark:text-amber-300">
                <Badge variant="outline" className="bg-amber-50 dark:bg-amber-950/40">
                  merge rule:
                </Badge>
                <span className="px-1.5 py-0.5 rounded border border-amber-300 dark:border-amber-700/60">
                  {currentStep.appliedMerge.pair[0]}
                </span>
                <span>+</span>
                <span className="px-1.5 py-0.5 rounded border border-amber-300 dark:border-amber-700/60">
                  {currentStep.appliedMerge.pair[1]}
                </span>
                <ArrowRight className="h-3 w-3" />
                <span className="px-1.5 py-0.5 rounded border border-amber-300 bg-amber-200/60 dark:bg-amber-900/60 dark:border-amber-700/60 font-bold">
                  {currentStep.appliedMerge.merged}
                </span>
              </div>
            )}
          </Card>

          {/* Список обученных merges */}
          <div className="rounded-lg border border-amber-200 bg-amber-50/50 dark:border-amber-800/60 dark:bg-amber-950/30 p-3">
            <div className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300 mb-2">
              Обученные merges (применяются сверху вниз)
            </div>
            <div className="flex flex-wrap gap-1.5 text-xs font-mono">
              {TRAINING_MERGES.map((m, i) => (
                <span
                  key={i}
                  className={cn(
                    "px-1.5 py-0.5 rounded border",
                    currentStep.appliedMerge?.merged === m.merged
                      ? "border-amber-500 bg-amber-200 dark:bg-amber-800/60 font-bold"
                      : "border-amber-300/60 bg-amber-50 dark:bg-amber-950/40 dark:border-amber-800/40 text-muted-foreground"
                  )}
                >
                  {m.pair[0]}+{m.pair[1]}={m.merged}
                </span>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2 italic">
              Это лишь первые 13 правил из ~50 000 в реальном GPT-2. Каждое
              следующее правило работает с результатом предыдущего.
            </p>
          </div>
        </div>
      </SandboxBlock>
    </ModuleShell>
  );
}
