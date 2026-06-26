"use client";

import { useState } from "react";
import { ModuleShell, TheoryBlock, SandboxBlock, GoalBlock, DefCard, ConceptChip } from "@/components/learn/shell";
import { ACCENTS } from "@/components/learn/accents";
import { tokenize, TOKEN_COLORS, type TokenType } from "@/lib/tokenizer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SAMPLE_TEXT = "Привет, мир! Машинное обучение.";
const LEVELS: Array<{ type: TokenType; label: string; tagline: string }> = [
  { type: "word", label: "Слова", tagline: "по пробелам" },
  { type: "char", label: "Символы", tagline: "по буквам" },
  { type: "bpe", label: "BPE", tagline: "подслова" },
  { type: "wordpiece", label: "WordPiece", tagline: "с ##" },
];

export function Module02Levels() {
  const accent = ACCENTS[2];
  const [text, setText] = useState(SAMPLE_TEXT);

  return (
    <ModuleShell
      id={2}
      title="Уровни токенизации: слова, символы, подслова"
      subtitle="Есть три принципиально разных способа резать текст. У каждого свои плюсы и минусы — и каждый использовался в реальных моделях."
      accent={accent}
    >
      <GoalBlock accent={accent}>
        увидеть своими глазами, как одна и та же фраза разбивается на 4 разных набора токенов.
      </GoalBlock>

      <TheoryBlock accent={accent}>
        <p>
          Все токенизаторы делятся на три большие семьи. Разница между ними — в
          том, что считается «атомарной единицей» текста: целое слово, отдельный
          символ или подслово (несколько символов, обычно слог или корень).
        </p>
        <div className="grid sm:grid-cols-3 gap-3 not-prose">
          <DefCard
            accent={accent}
            term="Word-level"
            definition="Атом = слово. Просто, но словарь огромный (сотни тысяч), а новые слова попадают в <UNK>."
            example="«привет» → [привет]"
          />
          <DefCard
            accent={accent}
            term="Character-level"
            definition="Атом = символ. Словарь крошечный (~256), но последовательности получаются очень длинными — модель учится медленно."
            example="«привет» → [п,р,и,в,е,т]"
          />
          <DefCard
            accent={accent}
            term="Subword-level"
            definition="Атом = подслово (частый кусок). Баланс: маленький словарь + короткие последовательности + любое слово можно разобрать."
            example="«непонимание» → [не, понима, ние]"
          />
        </div>
        <p>
          Исторически первые модели использовали word-level (просто потому что
          так легче). Затем в машинном переводе перешли на char-level (для
          редких языков и опечаток). А начиная с 2018-2019 годов доминирует
          subword: BPE в GPT-2/4 и Llama, WordPiece в BERT, Unigram в T5 и ALBERT.
        </p>
        <p>
          Почему subword победил? Потому что он решает сразу три проблемы:
          малый vocab (модель не раздувается), никаких <ConceptChip>&lt;UNK&gt;</ConceptChip> для
          новых слов (любое слово можно собрать из подслов), и разумная длина
          последовательностей (в 5-10 раз короче, чем char-level).
        </p>
      </TheoryBlock>

      <SandboxBlock accent={accent} title="Сравни 4 уровня на одном тексте">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-fuchsia-700 dark:text-fuchsia-300">
              Введи свой текст
            </label>
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Напиши что-нибудь..."
              className="mt-1 font-mono"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {LEVELS.map((lvl, idx) => {
              const tokens = tokenize(text, lvl.type);
              const paletteIdx = idx;
              return (
                <div
                  key={lvl.type}
                  className="rounded-lg border border-fuchsia-200 dark:border-fuchsia-800/60 p-3 bg-card"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{lvl.label}</span>
                      <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wide">
                        {lvl.tagline}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-fuchsia-700 dark:text-fuchsia-300">
                      {tokens.length} ток.
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 min-h-[3rem]">
                    {tokens.length === 0 ? (
                      <span className="text-xs text-muted-foreground italic">
                        пусто
                      </span>
                    ) : (
                      tokens.map((t, i) => (
                        <span
                          key={i}
                          className={cn("tok", TOKEN_COLORS[(paletteIdx + i) % TOKEN_COLORS.length])}
                          title={`ID: ${t.id}`}
                        >
                          {t.text === " " ? "·" : t.text}
                          <span className="ml-1 text-[10px] opacity-60">
                            {t.id}
                          </span>
                        </span>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="rounded-lg border border-fuchsia-200 bg-fuchsia-50 dark:border-fuchsia-800/60 dark:bg-fuchsia-950/40 p-3 text-sm">
            <div className="font-semibold text-fuchsia-700 dark:text-fuchsia-300 mb-1">
              На что обратить внимание
            </div>
            <ul className="space-y-1 text-foreground/90">
              <li>— Сравни число токенов: char всегда больше всех, word — меньше всех (если нет <ConceptChip>&lt;UNK&gt;</ConceptChip>).</li>
              <li>— BPE и WordPiece дают похожий результат, но WordPiece использует <ConceptChip>##</ConceptChip> префикс для продолжений.</li>
              <li>— Знаки препинания в word-level — отдельные токены; в BPE часто сливаются с соседями.</li>
              <li>— Наведи на любой токен — увидишь его ID в словаре.</li>
            </ul>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setText("Привет, мир! Машинное обучение.")}
            >
              Пример 1: классика
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setText("Tokenization splits text into pieces.")}
            >
              Пример 2: английский
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setText("Непонимание — это тоже слово.")}
            >
              Пример 3: длинное слово
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setText("")}
            >
              Очистить
            </Button>
          </div>
        </div>
      </SandboxBlock>
    </ModuleShell>
  );
}
