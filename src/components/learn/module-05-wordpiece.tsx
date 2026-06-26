"use client";

import { useState } from "react";
import { ModuleShell, TheoryBlock, SandboxBlock, GoalBlock, ConceptChip, DefCard } from "@/components/learn/shell";
import { ACCENTS } from "@/components/learn/accents";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

// Учебный WordPiece-словарь (по мотивам BERT)
const WP_VOCAB = new Map<string, number>([
  ["[PAD]", 0], ["[UNK]", 1], ["[CLS]", 2], ["[SEP]", 3], ["[MASK]", 4],
  ["т", 5], ["о", 6], ["к", 7], ["е", 8], ["н", 9], ["и", 10], ["з", 11],
  ["а", 12], ["ц", 13], ["я", 14], ["##о", 15], ["##к", 16], ["##е", 17],
  ["##н", 18], ["##и", 19], ["##з", 20], ["##а", 21], ["##ц", 22], ["##я", 23],
  ["то", 24], ["##ок", 25], ["ток", 26], ["##ен", 27], ["токе", 28],
  ["токен", 29], ["иза", 30], ["##ция", 31], ["##изация", 32],
  ["токенизация", 33], ["при", 34], ["##вет", 35], ["привет", 36],
  ["не", 37], ["##по", 38], ["##нима", 39], ["##ние", 40],
  ["непонимание", 41], ["мир", 42], ["м", 43], ["##р", 44],
]);

type WpStep = {
  remaining: string;
  matched?: string;
  description: string;
};

function buildWpSteps(word: string): WpStep[] {
  const lower = word.toLowerCase();
  const steps: WpStep[] = [];
  let pos = 0;
  let isFirst = true;
  let failed = false;

  steps.push({
    remaining: lower,
    description: `Старт: берём слово «${word}». WordPiece идёт слева направо и жадно ищет самое длинное совпадение.`,
  });

  while (pos < lower.length) {
    let end = lower.length;
    let matched = "";
    while (end > pos) {
      const sub = lower.substring(pos, end);
      const candidate = isFirst ? sub : "##" + sub;
      if (WP_VOCAB.has(candidate)) {
        matched = candidate;
        break;
      }
      end--;
    }
    if (!matched) {
      steps.push({
        remaining: lower.substring(pos),
        description: `Не нашли совпадения для «${lower.substring(pos)}». Слово целиком уходит в [UNK].`,
      });
      failed = true;
      break;
    }
    steps.push({
      remaining: lower.substring(pos + (end - pos)),
      matched,
      description: `Нашли самое длинное совпадение: «${matched}»${isFirst ? " (без ##, первая часть)" : " (с ##, продолжение)"}. Сдвигаемся на ${end - pos} символа(ов).`,
    });
    pos = end;
    isFirst = false;
  }

  if (!failed) {
    steps.push({
      remaining: "",
      description: `Готово: слово разобрано на ${steps.filter((s) => s.matched).length} подслов(а).`,
    });
  }
  return steps;
}

const PRESETS = ["токенизация", "привет", "непонимание", "мир"];

export function Module05Wordpiece() {
  const accent = ACCENTS[5];
  const [word, setWord] = useState("непонимание");
  const [stepIdx, setStepIdx] = useState(0);

  const safeWord = word.trim() || "непонимание";
  const steps = buildWpSteps(safeWord);
  const clampedIdx = Math.min(stepIdx, steps.length - 1);
  const currentStep = steps[clampedIdx];

  function reset(newWord?: string) {
    if (newWord !== undefined) setWord(newWord);
    setStepIdx(0);
  }

  const matchedSteps = steps.filter((s) => s.matched);

  return (
    <ModuleShell
      id={5}
      title="WordPiece — токенизация BERT с ## префиксом"
      subtitle="WordPiece — брат BPE, но с другим способом обучения и другим синтаксисом: продолжения слова помечаются ##. Используется в BERT, DistilBERT, Electra."
      accent={accent}
    >
      <GoalBlock accent={accent}>
        понять, чем WordPiece отличается от BPE, и увидеть жадный алгоритм слева направо в действии.
      </GoalBlock>

      <TheoryBlock accent={accent}>
        <p>
          WordPiece предложен в 2012 году исследователями из Google для
          машинного перевода, а известность получил благодаря BERT (2018).
          Внешне он похож на BPE — тоже подсловная токенизация, — но есть два
          ключевых отличия.
        </p>
        <div className="grid sm:grid-cols-2 gap-3 not-prose">
          <DefCard
            accent={accent}
            term="## префикс"
            definition="Любая часть слова, которая стоит НЕ в начале, получает префикс «##». Так модель отличает «the» в начале слова от «##the» в середине."
            example="«токенизация» → [токен, ##изация]"
          />
          <DefCard
            accent={accent}
            term="Критерий обучения"
            definition="BPE выбирает самую частую пару. WordPiece — пару, которая максимизирует likelihood корпуса (вероятность). Это даёт чуть другие merges."
            example="BPE: «ab» если часто. WP: «ab» если p(ab)/(p(a)·p(b)) велико."
          />
        </div>
        <p>
          При apply (на этапе инференса) WordPiece работает <strong>жадно
          слева направо</strong>: берёт слово, ищет самое длинное совпадение
          в словаре (без <ConceptChip>##</ConceptChip>), потом от оставшейся
          части ищет самое длинное совпадение с <ConceptChip>##</ConceptChip>,
          и так далее. Если на каком-то шаге совпадения нет — слово целиком
          превращается в <ConceptChip>[UNK]</ConceptChip>.
        </p>
        <p>
          Этот «жадный» подход проще и быстрее BPE (где нужно учитывать порядок
          всех merges), но теоретически менее оптимален: иногда выгоднее было
          взять короче сейчас, чтобы потом匹配лось лучше. На практике разница
          невелика.
        </p>
        <p>
          Где используется WordPiece:
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>BERT (включая multilingual-BERT, vocab 119 547 для 104 языков)</li>
          <li>DistilBERT, RoBERTa-базовые</li>
          <li>Electra</li>
          <li>Оригинальный Google Translate (2016)</li>
        </ul>
      </TheoryBlock>

      <SandboxBlock accent={accent} title="WordPiece по шагам: жадный разбор слева направо">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-orange-700 dark:text-orange-300">
              Слово для разбора
            </label>
            <div className="flex gap-2 mt-1">
              <Input
                value={word}
                onChange={(e) => reset(e.target.value.toLowerCase())}
                placeholder="например: непонимание"
                className="font-mono"
              />
              <Button variant="outline" size="sm" onClick={() => reset()}>
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
              <span className="text-xs font-semibold uppercase tracking-wide text-orange-700 dark:text-orange-300">
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

            {/* Текущее состояние: что осталось разобрать */}
            <div className="rounded-lg bg-orange-50/50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800/60 p-3 mb-3">
              <div className="text-xs uppercase tracking-wide text-orange-700 dark:text-orange-300 mb-1.5">
                Что осталось разобрать
              </div>
              <div className="font-mono text-lg">
                {currentStep.remaining ? (
                  <span className="px-2 py-1 rounded border border-dashed border-orange-400">
                    {currentStep.remaining}
                  </span>
                ) : (
                  <span className="text-muted-foreground italic text-sm">
                    (пусто — разобрали всё)
                  </span>
                )}
              </div>
            </div>

            {/* Текущее совпадение */}
            {currentStep.matched && (
              <div className="text-xs font-mono flex items-center gap-2 text-orange-700 dark:text-orange-300">
                <Badge variant="outline" className="bg-orange-50 dark:bg-orange-950/40">
                  matched:
                </Badge>
                <span className="px-1.5 py-0.5 rounded border border-orange-300 bg-orange-200/60 dark:bg-orange-900/60 dark:border-orange-700/60 font-bold">
                  {currentStep.matched}
                </span>
                <ArrowRight className="h-3 w-3" />
                <span className="text-muted-foreground">
                  ID: {WP_VOCAB.get(currentStep.matched)}
                </span>
              </div>
            )}

            {/* Финальный результат */}
            {clampedIdx === steps.length - 1 && matchedSteps.length > 0 && (
              <div className="mt-3 pt-3 border-t border-orange-200 dark:border-orange-800/60">
                <div className="text-xs uppercase tracking-wide text-orange-700 dark:text-orange-300 mb-2">
                  Итоговый разбор
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {matchedSteps.map((s, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 rounded border border-orange-300 bg-orange-100 text-orange-800 font-mono text-sm dark:bg-orange-900/50 dark:text-orange-200 dark:border-orange-700/60"
                    >
                      {s.matched}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </Card>

          <div className="rounded-lg border border-orange-200 bg-orange-50 dark:border-orange-800/60 dark:bg-orange-950/40 p-3 text-sm">
            <div className="font-semibold text-orange-700 dark:text-orange-300 mb-1">
              Чем WordPiece отличается от BPE — кратко
            </div>
            <ul className="space-y-1 text-foreground/90">
              <li>— <strong>## префикс</strong> явно отличает «продолжение слова» от «начала слова».</li>
              <li>— <strong>Жадный разбор слева направо</strong>, а не итеративное применение merges по приоритету.</li>
              <li>— <strong>Критерий обучения</strong> — likelihood, а не частота пар.</li>
              <li>— <strong>Спецтокены в квадратных скобках</strong>: <ConceptChip>[CLS]</ConceptChip> <ConceptChip>[SEP]</ConceptChip> <ConceptChip>[MASK]</ConceptChip> <ConceptChip>[PAD]</ConceptChip> <ConceptChip>[UNK]</ConceptChip>.</li>
              <li>— Если часть не находится — слово целиком → <ConceptChip>[UNK]</ConceptChip> (у BPE fallback на символы).</li>
            </ul>
          </div>
        </div>
      </SandboxBlock>
    </ModuleShell>
  );
}
