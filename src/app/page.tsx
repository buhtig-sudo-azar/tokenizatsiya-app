"use client";

import { ProgressProvider, useProgress } from "@/lib/use-progress";
import { MODULE_META, ACCENTS } from "@/components/learn/accents";
import { Module01Intro } from "@/components/learn/module-01-intro";
import { Module02Levels } from "@/components/learn/module-02-levels";
import { Module03Vocab } from "@/components/learn/module-03-vocab";
import { Module04Bpe } from "@/components/learn/module-04-bpe";
import { Module05Wordpiece } from "@/components/learn/module-05-wordpiece";
import { Module06Special } from "@/components/learn/module-06-special";
import { Module07Sandbox } from "@/components/learn/module-07-sandbox";
import { Module08Models } from "@/components/learn/module-08-models";
import { Module09Next } from "@/components/learn/module-09-next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Brain,
  Sparkles,
  ArrowDown,
  ArrowLeft,
  Heart,
  Trash2,
  CheckCircle2,
  FlaskConical,
  Type,
} from "lucide-react";

const ML_S_NULA_URL = "https://ml-s-nula.vercel.app/";
const EMBEDDINGS_APP_URL = "https://embeddings-app.vercel.app/";
const TRANSFORMERS_URL = "https://transformers-architecture.vercel.app/";
const NN_LEARNING_URL = "https://nn-learning-app.vercel.app/";
const LLM_APP_URL = "https://llms-app.vercel.app/";

function Hero() {
  const { completedCount, totalCount, hydrated, resetAll } = useProgress();
  const progressPct = hydrated ? (completedCount / totalCount) * 100 : 0;

  return (
    <section className="relative overflow-hidden border-b">
      {/* Декоративный фон */}
      <div className="hero-decoration absolute inset-0 opacity-[0.04] pointer-events-none">
        <div className="absolute top-10 left-10 text-[200px] font-bold font-mono text-purple-900 dark:text-purple-400">
          [T]
        </div>
        <div className="absolute bottom-10 right-10 text-[150px] font-bold font-mono text-fuchsia-900 dark:text-fuchsia-400">
          {"{ }"}
        </div>
        <div className="absolute top-1/2 left-1/3 text-[120px] font-bold font-mono text-rose-900 dark:text-rose-400">
          10110
        </div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="max-w-2xl">
            <a
              href={ML_S_NULA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mb-3 text-xs text-muted-foreground hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Назад к курсу «ML с нуля»
            </a>
            <a
              href="https://embeddings-app.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex mb-3"
            >
              <Badge
                variant="outline"
                className="bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100 transition-colors dark:bg-emerald-950/50 dark:border-emerald-700/60 dark:text-emerald-300 dark:hover:bg-emerald-900/50"
              >
                <Sparkles className="h-3 w-3 mr-1" />
                Продолжение: эмбеддинги и attention →
              </Badge>
            </a>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
              Как машины читают текст
            </h1>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
              9 модулей о токенизации — о том, как фраза превращается в кусочки
              (токены), а те — в числа, которыми оперируют GPT, BERT и любые
              языковые модели. С живой песочницей BPE и WordPiece прямо в
              браузере.
            </p>

            <div className="flex flex-wrap gap-3 mt-6">
              <a href="#module-1">
                <Button
                  size="lg"
                  className="bg-purple-600 hover:bg-purple-700 text-white dark:bg-purple-700 dark:hover:bg-purple-600"
                >
                  Начать с первого модуля
                  <ArrowDown className="h-4 w-4 ml-1.5" />
                </Button>
              </a>
              <a href="#module-7">
                <Button size="lg" variant="outline">
                  <FlaskConical className="h-4 w-4 mr-1.5" />
                  Сразу в песочницу
                </Button>
              </a>
            </div>
          </div>

          {/* Карточка прогресса */}
          <Card className="p-4 w-full sm:w-64 bg-card/95">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">
                Твой прогресс
              </span>
              {hydrated && completedCount === totalCount && (
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              )}
            </div>
            <div className="text-2xl font-bold font-mono">
              {hydrated ? completedCount : 0}
              <span className="text-base text-muted-foreground font-normal">
                {" "}
                / {totalCount}
              </span>
            </div>
            <Progress value={progressPct} className="h-2 mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              модулей отмечено как пройденные
            </p>
            {hydrated && completedCount > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-full mt-2 h-7 text-xs text-muted-foreground"
                onClick={resetAll}
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Сбросить прогресс
              </Button>
            )}
          </Card>
        </div>

        {/* Бейджи характеристик */}
        <div className="flex flex-wrap gap-2 mt-8">
          <Badge variant="secondary" className="bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950/50 dark:border-amber-800/60 dark:text-amber-300">
            <FlaskConical className="h-3 w-3 mr-1" />
            Живые песочницы BPE и WordPiece
          </Badge>
          <Badge variant="secondary" className="bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950/50 dark:border-rose-800/60 dark:text-rose-300">
            <Brain className="h-3 w-3 mr-1" />
            Без формул — сначала смысл
          </Badge>
          <Badge variant="secondary" className="bg-teal-50 border-teal-200 text-teal-800 dark:bg-teal-950/50 dark:border-teal-800/60 dark:text-teal-300">
            <Type className="h-3 w-3 mr-1" />
            Прогресс сохраняется
          </Badge>
        </div>
      </div>
    </section>
  );
}

function ModuleNav() {
  const { isCompleted, hydrated } = useProgress();
  return (
    <nav
      className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b"
      aria-label="Навигация по модулям"
    >
      <div className="max-w-6xl mx-auto px-2 sm:px-6">
        <div className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-thin">
          {MODULE_META.map((m) => {
            const done = hydrated && isCompleted(m.id);
            const accent = ACCENTS[m.id];
            return (
              <a
                key={m.id}
                href={`#module-${m.id}`}
                className={cn(
                  "shrink-0 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors border",
                  done
                    ? "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/50 dark:border-emerald-800/60 dark:text-emerald-300"
                    : cn("border-transparent hover:bg-muted", accent.text)
                )}
              >
                <span className="font-mono mr-1">{m.id}.</span>
                {m.short}
                {done && <CheckCircle2 className="inline h-3 w-3 ml-1" />}
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

function MainContent() {
  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <Module01Intro />
      <Module02Levels />
      <Module03Vocab />
      <Module04Bpe />
      <Module05Wordpiece />
      <Module06Special />
      <Module07Sandbox />
      <Module08Models />
      <Module09Next />
    </main>
  );
}

function SiteFooter() {
  return (
    <footer className="mt-auto border-t bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 text-sm text-muted-foreground">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Type className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            <span>
              <strong className="text-foreground">Токенизация</strong> —
              интерактивный курс о том, как машины читают текст
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            Сделано с <Heart className="h-3 w-3 fill-rose-500 text-rose-500 dark:fill-rose-400 dark:text-rose-400" /> для
            разработчиков, изучающих NLP
          </div>
        </div>
        <p className="text-xs mt-3 max-w-3xl">
          Все песочницы работают прямо в браузере на чистом JavaScript (React + TypeScript).
          Прогресс сохраняется локально в localStorage — твои ответы и метки
          не уходят на сервер. Это приложение — второй курс в серии из десяти:{" "}
          <a href={ML_S_NULA_URL} target="_blank" rel="noopener noreferrer" className="underline hover:text-purple-700 dark:hover:text-purple-300">«ML с нуля»</a>
          {" → "}<strong className="text-foreground">«Токенизация»</strong>
          {" → "}<a href={EMBEDDINGS_APP_URL} target="_blank" rel="noopener noreferrer" className="underline hover:text-purple-700 dark:hover:text-purple-300">«Эмбеддинги и attention»</a>
          {" → "}<a href={TRANSFORMERS_URL} target="_blank" rel="noopener noreferrer" className="underline hover:text-purple-700 dark:hover:text-purple-300">«Трансформеры»</a>
          {" → "}<a href={NN_LEARNING_URL} target="_blank" rel="noopener noreferrer" className="underline hover:text-purple-700 dark:hover:text-purple-300">«Как нейросети учатся»</a>
          {" → "}<a href={LLM_APP_URL} target="_blank" rel="noopener noreferrer" className="underline hover:text-purple-700 dark:hover:text-purple-300">«Большие языковые модели»</a>
          {" → "}<a href="https://alignment-app.vercel.app/" target="_blank" rel="noopener noreferrer" className="underline hover:text-purple-700 dark:hover:text-purple-300">«Адаптация и alignment»</a>
          .
        </p>

        <div className="mt-6 pt-4 border-t border-border/60 text-center">
          <span className="text-sm font-medium text-muted-foreground">
            создатель{" "}
            <span className="font-bold tracking-wide text-foreground">AZAR</span>
          </span>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <ProgressProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <Hero />
        <ModuleNav />
        <MainContent />
        <SiteFooter />
      </div>
    </ProgressProvider>
  );
}
