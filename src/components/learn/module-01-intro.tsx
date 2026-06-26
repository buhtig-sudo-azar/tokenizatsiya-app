"use client";

import { ModuleShell, TheoryBlock, GoalBlock, DefCard, ConceptChip } from "@/components/learn/shell";
import { ACCENTS } from "@/components/learn/accents";

export function Module01Intro() {
  const accent = ACCENTS[1];

  return (
    <ModuleShell
      id={1}
      title="Что такое токенизация — и зачем она нужна"
      subtitle="Прежде чем любая языковая модель увидит текст, его нужно превратить в числа. Этот шаг и называется токенизацией."
      accent={accent}
    >
      <GoalBlock accent={accent}>
        понять, что такое токен и почему нельзя просто «скормить текст в модель как есть».
      </GoalBlock>

      <TheoryBlock accent={accent}>
        <p>
          Компьютер не понимает букв. Он понимает только числа. Поэтому перед
          тем, как языковая модель (GPT, BERT, Llama — любая) начнёт работать
          с текстом, этот текст нужно разрезать на кусочки и каждому кусочку
          присвоить число. Этот процесс и называется <strong>токенизацией</strong>,
          а сами кусочки — <strong>токенами</strong>.
        </p>
        <p>
          Токеном может быть целое слово, часть слова, отдельный символ или
          даже байт. От того, как именно мы режем текст, зависит: сколько
          токенов получит модель, какой размер у словаря, как часто будет
          встречаться <ConceptChip>&lt;UNK&gt;</ConceptChip> (неизвестный токен)
          и насколько быстро идёт обучение и инференс.
        </p>
        <div className="grid sm:grid-cols-3 gap-3 not-prose">
          <DefCard
            accent={accent}
            term="Токен (token)"
            definition="Кусочек текста, который модель рассматривает как единое целое. Каждый токен имеет уникальный ID в словаре."
            example="«при», «вет», «,», «мир»"
          />
          <DefCard
            accent={accent}
            term="Словарь (vocab)"
            definition="Список всех токенов, которые знает модель. Каждому присвоен свой ID (целое число)."
            example="GPT-4: ~100 000 токенов, BERT: ~30 000"
          />
          <DefCard
            accent={accent}
            term="ID токена"
            definition="Целое число, которым модель реально оперирует. Текст → токены → ID → эмбеддинги → слои модели."
            example="«привет» → ID 1234"
          />
        </div>
        <p>
          Почему это важно? Потому что от выбора токенизатора напрямую зависят
          <strong> деньги и скорость</strong>. Один и тот же текст при word-токенизации
          может занять 100 токенов, при char-токенизации — 600, а при BPE — 130.
          Модели оплачиваются и работают «за токен»: чем меньше токенов на тот
          же текст, тем дешевле и быстрее.
        </p>
        <p>
          Кроме того, токенизация определяет, что модель <em>вообще способна</em> увидеть.
          Если в словаре нет токена для конкретного подслова, модель получит
          <ConceptChip>&lt;UNK&gt;</ConceptChip> и просто «не заметит» его. Поэтому
          современные токенизаторы (BPE, WordPiece) строятся из подслов — это
          позволяет покрыть любое слово через комбинацию известных кусочков.
        </p>
      </TheoryBlock>

      <div className="rounded-lg border-2 border-dashed border-purple-200 bg-purple-50/50 dark:border-purple-800/60 dark:bg-purple-950/30 p-4">
        <div className="text-xs uppercase tracking-wide text-purple-700 dark:text-purple-300 font-semibold mb-2">
          Аналогия из жизни
        </div>
        <p className="text-sm text-foreground/90 leading-relaxed">
          Представь, что ты учишь иностранный язык. Можно учить каждое слово
          целиком (<em>word-токенизация</em>) — но так язык бесконечен. Можно
          учить отдельные буквы (<em>char-токенизация</em>) — но из букв трудно
          сложить смысл. А можно учить слоги и частые корни (<em>BPE/WordPiece</em>)
          — тогда любое новое слово легко разбирается на знакомые части. Именно
          этот путь и выбрали современные языковые модели.
        </p>
      </div>

      <div className="rounded-lg border border-purple-200 bg-purple-50 dark:border-purple-800/60 dark:bg-purple-950/40 p-4 text-sm">
        <div className="font-semibold text-purple-700 dark:text-purple-300 mb-2">
          Что ты будешь уметь после курса
        </div>
        <ul className="space-y-1.5 text-foreground/90">
          <li>— Объяснять, чем токен отличается от слова и символа</li>
          <li>— Понимать, как работает BPE и WordPiece на уровне алгоритма</li>
          <li>— Видеть, во сколько токенов GPT-4 разобьёт конкретную фразу</li>
          <li>— Знать, зачем нужны специальные токены <ConceptChip>&lt;PAD&gt;</ConceptChip> <ConceptChip>&lt;UNK&gt;</ConceptChip> <ConceptChip>&lt;BOS&gt;</ConceptChip> <ConceptChip>&lt;EOS&gt;</ConceptChip> <ConceptChip>&lt;CLS&gt;</ConceptChip> <ConceptChip>&lt;SEP&gt;</ConceptChip></li>
          <li>— Выбирать подходящий токенизатор под задачу</li>
        </ul>
      </div>
    </ModuleShell>
  );
}
