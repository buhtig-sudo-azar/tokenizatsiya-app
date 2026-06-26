"use client";

import { useState } from "react";
import { ModuleShell, TheoryBlock, SandboxBlock, GoalBlock, DefCard, ConceptChip } from "@/components/learn/shell";
import { ACCENTS } from "@/components/learn/accents";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Учебный словарь — имитация словаря модели
const VOCAB: Array<{ token: string; id: number; freq: number }> = [
  { token: "<PAD>", id: 0, freq: 0 },
  { token: "<UNK>", id: 1, freq: 0 },
  { token: "<BOS>", id: 2, freq: 0 },
  { token: "<EOS>", id: 3, freq: 0 },
  { token: "привет", id: 4, freq: 8945 },
  { token: "мир", id: 5, freq: 7321 },
  { token: "модель", id: 6, freq: 6120 },
  { token: "токен", id: 7, freq: 5980 },
  { token: "обучение", id: 8, freq: 5410 },
  { token: "машинное", id: 9, freq: 4321 },
  { token: "мир", id: 10, freq: 7321 },
  { token: "the", id: 11, freq: 99812 },
  { token: "model", id: 12, freq: 12453 },
  { token: "##ение", id: 13, freq: 3120 },
  { token: "##ность", id: 14, freq: 2890 },
];

export function Module03Vocab() {
  const accent = ACCENTS[3];
  const [query, setQuery] = useState("привет");
  const [showFull, setShowFull] = useState(false);

  const found = VOCAB.find((v) => v.token === query.trim().toLowerCase());

  return (
    <ModuleShell
      id={3}
      title="Словарь и ID токенов — как модель видит текст"
      subtitle="После токенизации каждый токен заменяется на свой ID в словаре. Это и есть «язык», на котором модель реально работает."
      accent={accent}
    >
      <GoalBlock accent={accent}>
        понять, что словарь — это просто таблица «токен ↔ ID», и почему его размер критичен.
      </GoalBlock>

      <TheoryBlock accent={accent}>
        <p>
          Словарь (по-английски <strong>vocabulary</strong> или <strong>vocab</strong>) —
          это просто таблица из двух колонок: токен и его ID. Никакой магии.
          Когда модель получает на вход текст, она сначала превращает его в
          последовательность токенов, а затем каждый токен заменяет на его ID.
          Дальше уже работают слои модели — эмбеддинги, attention, MLP.
        </p>
        <div className="grid sm:grid-cols-2 gap-3 not-prose">
          <DefCard
            accent={accent}
            term="Vocab size"
            definition="Размер словаря — сколько уникальных токенов знает модель. Влияет на размер embedding-слоя и на частоту <UNK>."
            example="GPT-2 small: 50 257; GPT-4: ~100 000; BERT-base: 30 522"
          />
          <DefCard
            accent={accent}
            term="OOV (out-of-vocabulary)"
            definition="Слово, которого нет в словаре. Для word-level — это катастрофа (превращается в <UNK>). Для subword — не проблема."
            example="«кринж» в моделях до 2022 года"
          />
        </div>
        <p>
          Размер словаря — это всегда компромисс. Большой vocab = меньше
          <ConceptChip>&lt;UNK&gt;</ConceptChip> и короче последовательности, но
          больше embedding-слой (а он часто занимает значительную часть параметров
          модели). Маленький vocab = модель компактнее, но последовательности
          длиннее и обучение медленнее.
        </p>
        <p>
          Поэтому современные токенизаторы подбирают vocab так, чтобы покрыть
          ~99% слов в обучающем корпусе, а редкие слова пускать через subword-разбор.
          Это даёт разумный баланс: vocab 30-100 тысяч токенов хватает для
          большинства языков.
        </p>
      </TheoryBlock>

      <SandboxBlock accent={accent} title="Поиск токена в учебном словаре">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-rose-700 dark:text-rose-300">
              Введи токен, чтобы найти его ID
            </label>
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="напр.: привет, model, ##ение"
              className="mt-1 font-mono"
            />
          </div>

          <Card className="p-4">
            {found ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">
                    Токен
                  </span>
                  <Badge className="font-mono bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-900/40 dark:text-rose-200 dark:border-rose-700/60">
                    {found.token}
                  </Badge>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">
                    ID
                  </span>
                  <span className="font-mono text-2xl font-bold text-rose-700 dark:text-rose-300">
                    {found.id}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">
                    Частота в корпусе
                  </span>
                  <span className="font-mono text-sm">{found.freq}</span>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">
                    Токен
                  </span>
                  <Badge className="font-mono bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-900/40 dark:text-gray-200 dark:border-gray-700/60">
                    {query || "(пусто)"}
                  </Badge>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">
                    ID
                  </span>
                  <span className="font-mono text-2xl font-bold text-muted-foreground">
                    1
                  </span>
                  <Badge variant="outline" className="text-xs">
                    → <ConceptChip>&lt;UNK&gt;</ConceptChip> (нет в словаре)
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground italic mt-2">
                  Этот токен отсутствует в учебном словаре. В реальной модели он
                  тоже попал бы в <ConceptChip>&lt;UNK&gt;</ConceptChip> — если
                  только не разбился бы на подслова через BPE/WordPiece.
                </p>
              </div>
            )}
          </Card>

          <div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFull(!showFull)}
            >
              {showFull ? "Скрыть" : "Показать"} весь словарь ({VOCAB.length} токенов)
            </Button>
          </div>

          {showFull && (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-72 overflow-y-auto p-1">
              {VOCAB.map((v) => (
                <div
                  key={v.id}
                  className={cn(
                    "flex items-center justify-between gap-2 px-2 py-1.5 rounded border text-xs font-mono",
                    "border-rose-200 bg-rose-50/50 dark:border-rose-800/60 dark:bg-rose-950/30",
                    found?.id === v.id && "ring-2 ring-rose-400"
                  )}
                >
                  <span className="truncate">{v.token}</span>
                  <span className="text-rose-700 dark:text-rose-300 font-bold">
                    {v.id}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="rounded-lg border border-rose-200 bg-rose-50 dark:border-rose-800/60 dark:bg-rose-950/40 p-3 text-sm">
            <div className="font-semibold text-rose-700 dark:text-rose-300 mb-1">
              Что показывает этот пример
            </div>
            <ul className="space-y-1 text-foreground/90">
              <li>— Словарь — это буквально таблица «токен ↔ ID».</li>
              <li>— Спецтокены <ConceptChip>&lt;PAD&gt;</ConceptChip>, <ConceptChip>&lt;UNK&gt;</ConceptChip>, <ConceptChip>&lt;BOS&gt;</ConceptChip>, <ConceptChip>&lt;EOS&gt;</ConceptChip> занимают первые ID (обычно 0-5).</li>
              <li>— ID — это просто целые числа, никаких «смыслов» в них нет.</li>
              <li>— Один и тот же токен в разных моделях имеет разные ID (нет общего стандарта).</li>
            </ul>
          </div>
        </div>
      </SandboxBlock>
    </ModuleShell>
  );
}
