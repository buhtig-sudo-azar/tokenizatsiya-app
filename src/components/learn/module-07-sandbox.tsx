"use client";

import { useState, useMemo } from "react";
import { ModuleShell, TheoryBlock, SandboxBlock, GoalBlock, ConceptChip } from "@/components/learn/shell";
import { ACCENTS } from "@/components/learn/accents";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  tokenize,
  TOKEN_COLORS,
  TOKENIZER_LABELS,
  TOKENIZER_DESCRIPTIONS,
  type TokenType,
} from "@/lib/tokenizer";

const PRESETS: Array<{ label: string; text: string }> = [
  { label: "Русская классика", text: "Привет, мир! Машинное обучение — это интересно." },
  { label: "English", text: "Tokenization splits text into pieces called tokens." },
  { label: "Длинное слово", text: "Непротиворечивость — сложное слово для токенизатора." },
  { label: "Смесь RU+EN", text: "Я изучаю NLP и языковые модели вроде GPT-4." },
  { label: "Пунктуация", text: "Стоп!!! А где же... вопрос?!" },
  { label: "Программный код", text: "const x = token.split('').map(c => c.charCodeAt(0));" },
];

export function Module07Sandbox() {
  const accent = ACCENTS[7];
  const [text, setText] = useState("Привет, мир! Машинное обучение — это интересно.");
  const [active, setActive] = useState<TokenType>("bpe");

  const tokens = useMemo(() => tokenize(text, active), [text, active]);

  const stats = useMemo(() => {
    const total = tokens.length;
    const unkCount = tokens.filter((t) => t.id === 1).length;
    const uniqueIds = new Set(tokens.map((t) => t.id)).size;
    const avgLen = total > 0 ? (tokens.reduce((s, t) => s + t.text.length, 0) / total).toFixed(2) : "0";
    return { total, unkCount, uniqueIds, avgLen };
  }, [tokens]);

  return (
    <ModuleShell
      id={7}
      title="Песочница: попробуй токенизировать свой текст"
      subtitle="Главная песочница курса. Вводи любой текст, переключай токенизаторы, смотри, как меняется число токенов и какие ID им присвоены."
      accent={accent}
    >
      <GoalBlock accent={accent}>
        на практике почувствовать, как выбор токенизатора меняет длину последовательности и состав токенов.
      </GoalBlock>

      <TheoryBlock accent={accent}>
        <p>
          Это главная интерактивная песочница курса. Здесь ты можешь ввести
          любой текст — на русском, английском, смесь, даже программный код —
          и посмотреть, как его разобьют четыре разных токенизатора:
          word-level, char-level, BPE (GPT) и WordPiece (BERT).
        </p>
        <p>
          Каждый токен подсвечен своим цветом (для удобства визуального
          разделения), а рядом с ним стоит его ID в словаре. Наведи мышку на
          токен, чтобы увидеть его ID подробнее. Внизу — статистика: сколько
          всего токенов, сколько <ConceptChip>&lt;UNK&gt;</ConceptChip>, сколько
          уникальных ID и средняя длина токена.
        </p>
      </TheoryBlock>

      <SandboxBlock accent={accent} title="Ввод текста и выбор токенизатора">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
              Твой текст
            </label>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Напиши что-нибудь..."
              className="mt-1 font-mono min-h-[5rem]"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {(Object.keys(TOKENIZER_LABELS) as TokenType[]).map((t) => (
              <Button
                key={t}
                size="sm"
                variant={active === t ? "default" : "outline"}
                onClick={() => setActive(t)}
                className={
                  active === t
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-700 dark:hover:bg-emerald-600"
                    : ""
                }
              >
                {TOKENIZER_LABELS[t]}
              </Button>
            ))}
          </div>

          <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 dark:border-emerald-800/60 dark:bg-emerald-950/30 p-3 text-sm">
            <div className="font-semibold text-emerald-700 dark:text-emerald-300 mb-1">
              {TOKENIZER_LABELS[active]}
            </div>
            <p className="text-foreground/90">{TOKENIZER_DESCRIPTIONS[active]}</p>
          </div>

          {/* Статистика */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <StatCard label="Всего токенов" value={stats.total} />
            <StatCard label="<UNK> токенов" value={stats.unkCount} highlight={stats.unkCount > 0} />
            <StatCard label="Уникальных ID" value={stats.uniqueIds} />
            <StatCard label="Средняя длина" value={stats.avgLen} />
          </div>

          {/* Сами токены */}
          <Card className="p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300 mb-3">
              Токены ({tokens.length})
            </div>
            <div className="flex flex-wrap gap-1 min-h-[4rem]">
              {tokens.length === 0 ? (
                <span className="text-sm text-muted-foreground italic">
                  Введи текст выше, чтобы увидеть токены.
                </span>
              ) : (
                tokens.map((t, i) => (
                  <span
                    key={i}
                    className={cn("tok", TOKEN_COLORS[i % TOKEN_COLORS.length])}
                    title={`Токен: «${t.text}»\nID: ${t.id}\nТип: ${t.type}`}
                  >
                    {t.text === " " ? "·" : t.text === "\n" ? "↵" : t.text}
                    <span className="ml-1 text-[10px] opacity-60">{t.id}</span>
                  </span>
                ))
              )}
            </div>
          </Card>

          {/* ID-последовательность */}
          {tokens.length > 0 && (
            <Card className="p-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300 mb-2">
                Как это видит модель (последовательность ID)
              </div>
              <div className="font-mono text-xs leading-relaxed break-all bg-emerald-50/50 dark:bg-emerald-950/30 p-2 rounded border border-emerald-200 dark:border-emerald-800/60">
                [{tokens.map((t) => t.id).join(", ")}]
              </div>
              <p className="text-xs text-muted-foreground mt-2 italic">
                Именно эта последовательность чисел попадает в модель — дальше
                она превращается в эмбеддинги и проходит через слои.
              </p>
            </Card>
          )}

          {/* Пресеты */}
          <div>
            <div className="text-xs uppercase tracking-wide text-emerald-700 dark:text-emerald-300 font-semibold mb-2">
              Примеры
            </div>
            <div className="flex flex-wrap gap-1.5">
              {PRESETS.map((p) => (
                <Button
                  key={p.label}
                  variant="ghost"
                  size="sm"
                  className="text-xs h-7"
                  onClick={() => setText(p.text)}
                >
                  {p.label}
                </Button>
              ))}
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-7"
                onClick={() => setText("")}
              >
                Очистить
              </Button>
            </div>
          </div>
        </div>
      </SandboxBlock>
    </ModuleShell>
  );
}

function StatCard({ label, value, highlight }: { label: string; value: number | string; highlight?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-lg border p-3 text-center",
        highlight
          ? "border-rose-300 bg-rose-50 dark:border-rose-800/60 dark:bg-rose-950/40"
          : "border-emerald-200 bg-emerald-50/50 dark:border-emerald-800/60 dark:bg-emerald-950/30"
      )}
    >
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">
        {label}
      </div>
      <div className={cn(
        "text-xl font-bold font-mono mt-0.5",
        highlight ? "text-rose-700 dark:text-rose-300" : "text-emerald-700 dark:text-emerald-300"
      )}>
        {value}
      </div>
    </div>
  );
}
