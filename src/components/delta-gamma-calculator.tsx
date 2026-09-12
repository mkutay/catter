"use client";

import katex from "katex";
import { ArrowRight, Check, RotateCcw, X } from "lucide-react";
import { useCallback, useId, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { NumberInput } from "@/components/ui/number-input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type Difficulty = "easy" | "standard" | "hard";
type Mode = "trainer" | "sandbox";

export interface OptionScenario {
  isCall: boolean;
  s0: number;
  s1: number;
  deltaS: number;
  v0: number;
  delta: number;
  gamma: number;
  deltaEffect: number;
  gammaEffect: number;
  deltaV: number;
  expectedPrice: number;
}

const INITIAL_SCENARIO: OptionScenario = {
  isCall: true,
  s0: 100,
  s1: 102,
  deltaS: 2,
  v0: 5,
  delta: 0.5,
  gamma: 0.08,
  deltaEffect: 1,
  gammaEffect: 0.16,
  deltaV: 1.16,
  expectedPrice: 6.16,
};

const DIFFICULTIES: Difficulty[] = ["easy", "standard", "hard"];

function pickRandom<T>(values: readonly T[]): T {
  return values[Math.floor(Math.random() * values.length)];
}

function calculateEffects(delta: number, gamma: number, deltaS: number) {
  const deltaEffect = delta * deltaS;
  const gammaEffect = 0.5 * gamma * deltaS ** 2;
  const deltaV = deltaEffect + gammaEffect;

  return {
    deltaEffect: Number(deltaEffect.toFixed(4)),
    gammaEffect: Number(gammaEffect.toFixed(4)),
    deltaV: Number(deltaV.toFixed(4)),
  };
}

function generateScenario(difficulty: Difficulty): OptionScenario {
  const easy = difficulty === "easy";
  const standard = difficulty === "standard";
  const isCall = easy || Math.random() >= 0.5;
  const s0 = easy
    ? 100
    : standard
      ? pickRandom([50, 80, 100, 120, 150] as const)
      : pickRandom([45, 60, 75, 90, 105, 125] as const);
  const deltaS = easy
    ? pickRandom([-2, -1, 1, 2] as const)
    : standard
      ? pickRandom([-3, -2, -1, 1, 2, 3] as const)
      : pickRandom([-4, -3.5, -2.5, -1.5, 1.5, 2.5, 3.5, 4] as const);
  const callDelta = easy
    ? pickRandom([0.4, 0.5, 0.6] as const)
    : standard
      ? pickRandom([0.25, 0.3, 0.4, 0.5, 0.6, 0.7, 0.75] as const)
      : pickRandom([0.25, 0.35, 0.45, 0.55, 0.65, 0.75] as const);
  const delta = isCall ? callDelta : -callDelta;
  const gamma = easy
    ? pickRandom([0.04, 0.06, 0.08, 0.1] as const)
    : standard
      ? pickRandom([0.02, 0.04, 0.06, 0.08, 0.1] as const)
      : pickRandom([0.03, 0.05, 0.07, 0.09, 0.12] as const);
  const effects = calculateEffects(delta, gamma, deltaS);
  const prices = easy
    ? [3, 4, 5, 6]
    : standard
      ? [3, 3.5, 4, 4.5, 5, 6, 7.5]
      : [4.5, 5.5, 6.5, 8, 9.5, 11];
  const validPrices = prices.filter((price) => price + effects.deltaV >= 1);
  const v0 = pickRandom(validPrices.length ? validPrices : prices);

  return {
    isCall,
    s0,
    s1: Number((s0 + deltaS).toFixed(2)),
    deltaS,
    v0,
    delta,
    gamma,
    ...effects,
    expectedPrice: Number((v0 + effects.deltaV).toFixed(2)),
  };
}

function signed(value: number, digits = 2) {
  const formatted = value.toFixed(digits);
  return value >= 0 ? `+${formatted}` : formatted;
}

/**
 * KaTeX renderer component for inline or block mathematical operators and equations.
 */
function MathRenderer({
  math,
  inline = true,
  className,
}: {
  math: string;
  inline?: boolean;
  className?: string;
}) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(math, {
        displayMode: !inline,
        throwOnError: false,
        macros: {
          "\\textdollar": "\\$",
        },
      });
    } catch {
      return math;
    }
  }, [math, inline]);

  return (
    <span
      className={cn(inline ? "inline-block align-middle" : "block", className)}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: the HTML is safe
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function Metric({
  label,
  value,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1 text-sm">{label}</div>
      <div className="font-mono text-base font-semibold">{value}</div>
    </div>
  );
}

export function DeltaGammaCalculator() {
  const [mode, setMode] = useState<Mode>("trainer");
  const [difficulty, setDifficulty] = useState<Difficulty>("standard");
  const [scenario, setScenario] = useState(INITIAL_SCENARIO);
  const [userAnswer, setUserAnswer] = useState<number>();
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [customS0, setCustomS0] = useState(100);
  const [customS1, setCustomS1] = useState(102);
  const [customV0, setCustomV0] = useState(5);
  const [customDelta, setCustomDelta] = useState(0.5);
  const [customGamma, setCustomGamma] = useState(0.08);

  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const customV0Id = useId();
  const customS0Id = useId();
  const customS1Id = useId();
  const customDeltaId = useId();
  const customGammaId = useId();

  const nextProblem = useCallback((nextDifficulty: Difficulty) => {
    setScenario(generateScenario(nextDifficulty));
    setUserAnswer(undefined);
    setHasSubmitted(false);
    setIsCorrect(null);
    setErrorMessage(undefined);
    requestAnimationFrame(() => inputRef.current?.focus());
  }, []);

  const changeDifficulty = (nextDifficulty: Difficulty) => {
    setDifficulty(nextDifficulty);
    nextProblem(nextDifficulty);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (hasSubmitted) {
      nextProblem(difficulty);
      return;
    }

    if (userAnswer === undefined || Number.isNaN(userAnswer)) {
      setErrorMessage("Enter an option price.");
      return;
    }

    const correct = Math.abs(userAnswer - scenario.expectedPrice) <= 0.02;
    setHasSubmitted(true);
    setIsCorrect(correct);
    setErrorMessage(undefined);
    setTotalAnswered((value) => value + 1);

    if (correct) {
      setTotalCorrect((value) => value + 1);
      setStreak((value) => {
        const next = value + 1;
        setBestStreak((best) => Math.max(best, next));
        return next;
      });
    } else {
      setStreak(0);
    }
  };

  const resetSandbox = () => {
    setCustomS0(100);
    setCustomS1(102);
    setCustomV0(5);
    setCustomDelta(0.5);
    setCustomGamma(0.08);
  };

  const sandboxDeltaS = Number((customS1 - customS0).toFixed(2));
  const sandboxEffects = calculateEffects(
    customDelta,
    customGamma,
    sandboxDeltaS,
  );
  const sandboxNewPrice = Number((customV0 + sandboxEffects.deltaV).toFixed(2));
  const accuracy = totalAnswered
    ? Math.round((totalCorrect / totalAnswered) * 100)
    : 0;

  return (
    <Tabs
      value={mode}
      onValueChange={(value) => setMode(value as Mode)}
      className="my-8 w-full"
    >
      <TabsList>
        <TabsTrigger
          value="trainer"
          role="button"
          onClick={() => setMode("trainer")}
        >
          Trainer
        </TabsTrigger>
        <TabsTrigger
          value="sandbox"
          role="button"
          onClick={() => setMode("sandbox")}
        >
          Sandbox
        </TabsTrigger>
      </TabsList>

      <Card>
        {mode === "trainer" && (
          <>
            <CardHeader>
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div className="flex sm:flex-nowrap flex-wrap gap-2">
                  {DIFFICULTIES.map((item) => (
                    <Button
                      key={item}
                      type="button"
                      size="sm"
                      variant={difficulty === item ? "secondary" : "outline"}
                      onClick={() => changeDifficulty(item)}
                      className="capitalize"
                    >
                      {item}
                    </Button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1 text-xs text-muted-foreground font-mono justify-end">
                  <span>streak={streak}</span>
                  <span>bestStreak={bestStreak}</span>
                  <span>totalAnswered={totalAnswered}</span>
                  <span>totalCorrect={totalCorrect}</span>
                  <span>accuracy={accuracy}%</span>
                </div>
              </div>
            </CardHeader>
            <Separator />
          </>
        )}

        <TabsContent value="trainer">
          <CardContent className="space-y-4 pt-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-mono uppercase">
                  {scenario.isCall ? "Long call" : "Long put"} option
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => nextProblem(difficulty)}
              >
                <RotateCcw className="size-3" />
                New problem
              </Button>
            </div>

            <div className="flex flex-row justify-between">
              <Metric
                label={
                  <span>
                    Option price, <MathRenderer math="V_0" />
                  </span>
                }
                value={`$${scenario.v0.toFixed(2)}`}
              />
              <Metric
                label={
                  <span>
                    Underlying move, <MathRenderer math="\Delta S" />
                  </span>
                }
                value={`$${scenario.s0} → $${scenario.s1}`}
              />
              <Metric
                label={
                  <span>
                    Delta, <MathRenderer math="\Delta" />
                  </span>
                }
                value={signed(scenario.delta)}
              />
              <Metric
                label={
                  <span>
                    Gamma, <MathRenderer math="\Gamma" />
                  </span>
                }
                value={scenario.gamma.toFixed(2)}
              />
            </div>

            <form onSubmit={handleSubmit} className="flex flex-row gap-2">
              <Field data-invalid={!!errorMessage}>
                <NumberInput
                  ref={inputRef}
                  id={inputId}
                  value={userAnswer}
                  onValueChange={setUserAnswer}
                  placeholder="e.g. 6.16"
                  prefix="$"
                  stepper={0.1}
                  decimalScale={2}
                  disabled={hasSubmitted}
                  aria-invalid={!!errorMessage}
                  autoFocus
                  className="font-mono w-full"
                />
                <FieldError>{errorMessage}</FieldError>
              </Field>
              <Button type="submit" className="h-10">
                {hasSubmitted ? (
                  <>
                    Next Problem <ArrowRight />
                  </>
                ) : (
                  <>
                    <Check /> Check Price
                  </>
                )}
              </Button>
            </form>

            {hasSubmitted && (
              <Card
                role="status"
                className={cn(
                  "gap-4 p-4 shadow-none",
                  isCorrect ? "border-green" : "border-destructive",
                )}
              >
                <div className="flex items-center gap-2 font-medium">
                  {isCorrect ? (
                    <Check className="size-5 text-green" />
                  ) : (
                    <X className="size-5 text-destructive" />
                  )}
                  {isCorrect ? "Correct!" : "Incorrect."} The target is $
                  {scenario.expectedPrice.toFixed(2)}.
                </div>
                <Separator />
                <div className="grid gap-4 text-sm sm:grid-cols-3 *:space-y-1.5">
                  <div>
                    <p className="text-muted-foreground">Delta effect</p>
                    <p className="font-mono">
                      <MathRenderer
                        math={`${scenario.delta} \\times ${scenario.deltaS} = ${signed(scenario.deltaEffect)}`}
                      />
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Gamma effect</p>
                    <p className="font-mono">
                      <MathRenderer
                        math={`\\frac{1}{2} \\times ${scenario.gamma} \\times (${scenario.deltaS})^2 = ${signed(scenario.gammaEffect)}`}
                      />
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Estimated price</p>
                    <p className="font-mono">
                      <MathRenderer
                        math={`\\$${scenario.v0.toFixed(2)} ${signed(scenario.deltaV)} = \\$${scenario.expectedPrice.toFixed(2)}`}
                      />
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </CardContent>
        </TabsContent>

        <TabsContent value="sandbox">
          <CardContent className="space-y-6 pt-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3>Custom scenario</h3>
                <p className="text-sm text-muted-foreground">
                  Change the inputs to see the estimate update immediately.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={resetSandbox}
              >
                <RotateCcw /> Reset
              </Button>
            </div>

            <FieldGroup className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              <SandboxField
                id={customV0Id}
                label={
                  <span>
                    Option price, <MathRenderer math="V_0" />
                  </span>
                }
                value={customV0}
                onChange={setCustomV0}
                stepper={0.5}
                prefix="$"
              />
              <SandboxField
                id={customS0Id}
                label={
                  <span>
                    Initial stock price, <MathRenderer math="S_0" />
                  </span>
                }
                value={customS0}
                onChange={setCustomS0}
                stepper={1}
                prefix="$"
              />
              <SandboxField
                id={customS1Id}
                label={
                  <span>
                    New stock price, <MathRenderer math="S_1" />
                  </span>
                }
                value={customS1}
                onChange={setCustomS1}
                stepper={1}
                prefix="$"
              />
              <SandboxField
                id={customDeltaId}
                label={
                  <span>
                    Delta, <MathRenderer math="\Delta" />
                  </span>
                }
                value={customDelta}
                onChange={setCustomDelta}
                stepper={0.05}
              />
              <SandboxField
                id={customGammaId}
                label={
                  <span>
                    Gamma, <MathRenderer math="\Gamma" />
                  </span>
                }
                value={customGamma}
                onChange={setCustomGamma}
                stepper={0.01}
              />
            </FieldGroup>

            <div className="flex flex-row gap-4 justify-between">
              <Metric
                label={
                  <span>
                    Underlying move, <MathRenderer math="\Delta S" />
                  </span>
                }
                value={signed(sandboxDeltaS)}
              />
              <Metric
                label={
                  <span>
                    Delta effect, <MathRenderer math="\Delta \cdot \Delta S" />
                  </span>
                }
                value={signed(sandboxEffects.deltaEffect)}
              />
              <Metric
                label={
                  <span>
                    Gamma effect,{" "}
                    <MathRenderer math="\frac{1}{2}\Gamma(\Delta S)^2" />
                  </span>
                }
                value={signed(sandboxEffects.gammaEffect)}
              />
              <Metric
                label={
                  <span>
                    Total change, <MathRenderer math="\Delta V" />
                  </span>
                }
                value={signed(sandboxEffects.deltaV)}
              />
            </div>

            <Separator />

            <div className="flex flex-row flex-wrap gap-2 items-center">
              <MathRenderer
                math={`V_0 + \\Delta \\cdot \\Delta S + \\frac{1}{2} \\cdot \\Gamma \\cdot (\\Delta S)^2 = \\textdollar${sandboxNewPrice.toFixed(2)}`}
                className="text-lg"
              />
            </div>
          </CardContent>
        </TabsContent>
      </Card>
    </Tabs>
  );
}

function SandboxField({
  id,
  label,
  value,
  onChange,
  stepper,
  prefix,
}: {
  id: string;
  label: React.ReactNode;
  value: number;
  onChange: (value: number) => void;
  stepper: number;
  prefix?: string;
}) {
  return (
    <Field className="gap-1">
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <NumberInput
        id={id}
        value={value}
        onValueChange={(nextValue) => onChange(nextValue ?? 0)}
        stepper={stepper}
        prefix={prefix}
        decimalScale={2}
        className="font-mono"
      />
    </Field>
  );
}
