"use client";

import { ModuleShell, TheoryBlock, SandboxBlock, GoalBlock, ConceptChip } from "@/components/learn/shell";
import { ACCENTS } from "@/components/learn/accents";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowRight, ExternalLink, Code, BookOpen, Boxes, Wrench } from "lucide-react";

const ML_S_NULA_URL = "https://ml-s-nula.vercel.app/";

const RESOURCES: Array<{
  icon: typeof BookOpen;
  title: string;
  description: string;
  url: string;
  linkLabel: string;
  tag: string;
}> = [
  {
    icon: BookOpen,
    title: "Hugging Face NLP Course — Tokenizers",
    description:
      "Бесплатный курс от Hugging Face с подробным разбором BPE, WordPiece, Unigram. Живые примеры на Python, можно запустить в Colab.",
    url: "https://huggingface.co/learn/nlp-course/chapter6/1",
    linkLabel: "huggingface.co/learn/nlp-course",
    tag: "Курс",
  },
  {
    icon: Code,
    title: "Hugging Face Tokenizers Library",
    description:
      "Самая популярная библиотека токенизации. Быстрая (на Rust), поддерживает BPE, WordPiece, Unigram. Документация с примерами.",
    url: "https://huggingface.co/docs/tokenizers",
    linkLabel: "huggingface.co/docs/tokenizers",
    tag: "Библиотека",
  },
  {
    icon: Wrench,
    title: "tiktoken — токенизатор OpenAI",
    description:
      "Официальная Python-библиотека OpenAI для BPE-токенизации, используемой в GPT-3.5 и GPT-4. Можно посчитать токены locally.",
    url: "https://github.com/openai/tiktoken",
    linkLabel: "github.com/openai/tiktoken",
    tag: "Инструмент",
  },
  {
    icon: Boxes,
    title: "Tiktokenizer — live playground",
    description:
      "Веб-интерфейс, где можно ввести текст и посмотреть, как GPT-разбивает его на токены в реальном времени. Отличный визуальный инструмент.",
    url: "https://tiktokenizer.vercel.app/",
    linkLabel: "tiktokenizer.vercel.app",
    tag: "Playground",
  },
  {
    icon: BookOpen,
    title: "Оригинальная статья BPE для NLP",
    description:
      "Sennrich, Haddow, Birch (2015) — «Neural Machine Translation of Rare Words with Subword Units». Фундаментальная работа, где BPE впервые применили к нейросетям.",
    url: "https://aclanthology.org/P16-1162/",
    linkLabel: "aclanthology.org/P16-1162",
    tag: "Статья",
  },
  {
    icon: BookOpen,
    title: "WordPiece — оригинальная статья",
    description:
      "Schuster & Nakajima (2012) — «Japanese and Korean Voice Search». Здесь впервые описан WordPiece (изначально для азиатских языков).",
    url: "https://static.googleusercontent.com/media/research.google.com/en//pubs/archive/37842.pdf",
    linkLabel: "research.google.com/pub-archive",
    tag: "Статья",
  },
  {
    icon: BookOpen,
    title: "SentencePiece — описание библиотеки",
    description:
      "Kudo & Richardson (2018) — «SentencePiece: A simple and language independent subword tokenizer». Базовая статья по SentencePiece / Unigram.",
    url: "https://arxiv.org/abs/1808.06226",
    linkLabel: "arxiv.org/abs/1808.06226",
    tag: "Статья",
  },
  {
    icon: Code,
    title: "3Blue1Brown — Tokenization видео",
    description:
      "Короткое видео от 3Blue1Brown, которое визуально объясняет, как работают токены в GPT и почему с ними бывают проблемы (например, с цифрами).",
    url: "https://www.youtube.com/watch?v=zduSFxRajvE",
    linkLabel: "youtube.com — 3Blue1Brown",
    tag: "Видео",
  },
  {
    icon: BookOpen,
    title: "Karpathy — Let's build the GPT Tokenizer",
    description:
      "Двухчасовое видео Андрея Карпаты, где он с нуля реализует BPE на Python и разбирает все тонкости, включая byte-level подход GPT-2.",
    url: "https://www.youtube.com/watch?v=zduSFxRajvE",
    linkLabel: "youtube.com — Karpathy",
    tag: "Видео",
  },
];

const NEXT_TOPICS: Array<{
  icon: typeof Code;
  title: string;
  short: string;
  description: string;
}> = [
  {
    icon: Code,
    title: "Эмбеддинги (embeddings)",
    short: "Emb",
    description:
      "После токенизации каждый ID превращается в вектор (embedding). Это уже непрерывное пространство, в котором «похожие» токены лежат рядом.",
  },
  {
    icon: ArrowRight,
    title: "Attention-механизм",
    short: "Attn",
    description:
      "Сердце трансформеров. Позволяет модели смотреть на все токены сразу и решать, какие из них важны для текущего предсказания.",
  },
  {
    icon: BookOpen,
    title: "Языковые модели (LM)",
    short: "LM",
    description:
      "Модели, которые предсказывают следующий токен. GPT — авторегрессионная LM, BERT — маскированная (угадывает пропущенные токены).",
  },
  {
    icon: Wrench,
    title: "Fine-tuning и RLHF",
    short: "FT",
    description:
      "Как обучать большие модели на своих данных и подстраивать под человеческие предпочтения. Следующий уровень после базовой токенизации.",
  },
];

export function Module09Next() {
  const accent = ACCENTS[9];

  return (
    <ModuleShell
      id={9}
      title="Что изучать дальше — roadmap после токенизации"
      subtitle="Токенизация — это первый шаг NLP-пайплайна. Дальше идут эмбеддинги, attention, языковые модели и fine-tuning. Куда двигаться — зависит от цели."
      accent={accent}
    >
      <GoalBlock accent={accent}>
        составить план дальнейшего изучения NLP после того, как понятна токенизация.
      </GoalBlock>

      <TheoryBlock accent={accent}>
        <p>
          Токенизация — фундамент, но только первый из многих шагов. Если
          ты разобрался с BPE, WordPiece, спецтокенами и словарём — у тебя
          уже есть база, без которой невозможно читать статьи про трансформеры.
          Дальше идут четыре больших темы.
        </p>
        <p>
          Важный момент: <strong>токенизация имеет прямые практические
          последствия</strong>, о которых часто забывают. Странное поведение
          моделей на цифрах, проблемы с русским языком в ранних GPT, ограничения
          на длину контекста — всё это часто коренится в токенизации. Если
          модель «не понимает» простой вопрос — иногда дело не в модели, а в
          том, что токенизатор порезал текст неудачно.
        </p>
      </TheoryBlock>

      <SandboxBlock accent={accent} title="Что изучать после токенизации">
        <div className="grid sm:grid-cols-2 gap-3">
          {NEXT_TOPICS.map((t) => (
            <Card key={t.short} className="p-4 border-red-200 dark:border-red-800/60">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-200">
                  <t.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm">{t.title}</h3>
                    <Badge variant="outline" className="text-[10px] font-mono">
                      {t.short}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {t.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </SandboxBlock>

      <SandboxBlock accent={accent} title="Кураторские ресурсы для углубления">
        <div className="grid sm:grid-cols-2 gap-3">
          {RESOURCES.map((r) => (
            <a
              key={r.title}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Card className="p-4 border-red-200 dark:border-red-800/60 hover:border-red-400 hover:shadow-md transition-all h-full">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-200">
                    <r.icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-sm line-clamp-2">{r.title}</h3>
                    </div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <Badge variant="outline" className="text-[10px] font-mono">
                        {r.tag}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                      {r.description}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-red-700 dark:text-red-300 mt-2 font-mono">
                      <ExternalLink className="h-3 w-3" />
                      {r.linkLabel}
                    </div>
                  </div>
                </div>
              </Card>
            </a>
          ))}
        </div>
      </SandboxBlock>

      <div className="rounded-lg border-2 border-dashed border-red-200 bg-red-50/50 dark:border-red-800/60 dark:bg-red-950/30 p-5 text-center">
        <div className="text-xs uppercase tracking-wide text-red-700 dark:text-red-300 font-semibold mb-2">
          Возврат к материнскому курсу
        </div>
        <p className="text-sm text-muted-foreground mb-4 max-w-xl mx-auto">
          Это приложение — продолжение курса «ML с нуля». Если ты пришёл сюда
          из него и хочешь вернуться, чтобы продолжить с того места — кнопка
          ниже ведёт на главную страницу курса.
        </p>
        <a href={ML_S_NULA_URL} target="_blank" rel="noopener noreferrer">
          <Button
            size="lg"
            className="bg-purple-600 hover:bg-purple-700 text-white dark:bg-purple-700 dark:hover:bg-purple-600"
          >
            <ArrowUpRight className="h-4 w-4 mr-1.5" />
            Вернуться в «ML с нуля»
          </Button>
        </a>
      </div>
    </ModuleShell>
  );
}
