"use client";

import { useState } from "react";
import { TypographyH1 } from "./typography/headings";
import { TypographyParagraph } from "./typography/paragraph";
import { useToast } from "./ui/use-toast";
import { D20Dice } from "./d20-3d";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

export function Arg({
  hasKey
}: {
  hasKey: boolean;
}) {
  const { toast } = useToast();
  const [count, setCount] = useState(0);
  const [hasLogged, setHasLogged] = useState(false);

  const onRoll = (n: number) => {
    if (n >= 13) {
      setCount(count + 1);
    } else {
      setCount(0);
    }

    if (n === 20) {
      toast({
        title: "You rolled a 20!",
        description: "You are one step closer to being worthy!",
        duration: 3000,
      });
    } else if (n === 1) {
      toast({
        title: "You rolled a 1!",
        description: "You will never be worthy!",
        duration: 8000,
      });
    }
  };

  if (!hasKey) {
    return (
      <div className={cn("mt-16 w-full", count >= 3 ? "mb-10" : "mb-8")}>
        <TypographyH1>
          You are not <b>worthy</b> enough!
        </TypographyH1>
        <TypographyParagraph className="text-lg mt-6">
          You don&apos;t have the <i>secret</i> to view this page.
        </TypographyParagraph>
        <TypographyParagraph className="mt-8">
          In the meantime, look at this d20!
        </TypographyParagraph>
        <div className="mx-auto w-fit">
          <div className="dark:flex hidden">
            <D20Dice
              size="lg"
              onRoll={onRoll}
            />
          </div>
          <div className="dark:hidden flex">
            <D20Dice
              size="lg"
              onRoll={onRoll}
              meshColour="#8839ef"
              textColour="#4c4f69"
              outlineColour="#e6e9ef"
            />
          </div>
        </div>
        {count >= 2 && (
          <div className="w-fit mx-auto mt-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                >
                  ...
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Sana hiç kayseriden bahsetmiş miydim?</DialogTitle>
                </DialogHeader>
                <TypographyParagraph>
                  Ben hiç Kayseri&apos;nin ne kadar güzel olduğundan bahsetmiş miydim?
                  Kayseri medeniyetin merkezidir. Kayseri, Avrupa&apos;nın ve tüm Dünya&apos;nın merkezidir.
                  Kayseri&apos;yi gördüğümde hâlâ her şeyin iyiye, güzele gidebileceğini anladım.
                  Kayseri tamamen ayrı bir dünya. Kayseri tamamen farklı bir evren.
                </TypographyParagraph>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    )
  }
  
  if (!hasLogged) {
    console.log("Are you *really* sure that you have bested the simulation?");
    setHasLogged(true);
  }

  return (
    <div className="relative mt-16 w-full mb-8 min-h-screen overflow-hidden">
      {/* Background D20 dice with absolute positioning - reduced count for better performance */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top scattered dice */}
        <div className="absolute top-12 right-16 dark:block hidden opacity-60">
          <D20Dice size="md" />
        </div>
        <div className="absolute top-12 right-16 dark:hidden block opacity-60">
          <D20Dice size="md" meshColour="#8839ef" textColour="#4c4f69" outlineColour="#e6e9ef" />
        </div>

        {/* Middle scattered dice */}
        <div className="absolute top-64 left-12 dark:block hidden opacity-35">
          <D20Dice size="sm" />
        </div>
        <div className="absolute top-64 left-12 dark:hidden block opacity-35">
          <D20Dice size="sm" meshColour="#8839ef" textColour="#4c4f69" outlineColour="#e6e9ef" />
        </div>

        <div className="absolute top-96 right-1/3 dark:block hidden opacity-55">
          <D20Dice size="md" />
        </div>
        <div className="absolute top-96 right-1/4 dark:hidden block opacity-55">
          <D20Dice size="md" meshColour="#8839ef" textColour="#4c4f69" outlineColour="#e6e9ef" />
        </div>

        {/* Bottom scattered dice */}
        <div className="absolute bottom-32 left-20 dark:block hidden opacity-40">
          <D20Dice size="sm" />
        </div>
        <div className="absolute bottom-32 left-20 dark:hidden block opacity-40">
          <D20Dice size="sm" meshColour="#8839ef" textColour="#4c4f69" outlineColour="#e6e9ef" />
        </div>
      </div>

      {/* Main content with higher z-index */}
      <div className="relative z-10">
        <TypographyH1>
          And, that&apos;s all!
        </TypographyH1>
        <TypographyParagraph className="text-lg mt-6">
          You have proven yourself to be worthy enough!
        </TypographyParagraph>
        <TypographyParagraph className="text-lg mt-6">
          You have successfully passed the simulation.
        </TypographyParagraph>
        <TypographyParagraph className="text-xs mt-8">
          You are being watched.
        </TypographyParagraph>
        
        {/* Main interactive dice */}
        <div className="mx-auto w-fit mt-8">
          <div className="dark:block hidden">
            <D20Dice
              size="lg"
              onRoll={(n) => {
                if (n === 20) {
                  toast({
                    title: "LEGENDARY ROLL!",
                    description: "The dice gods smile upon you!",
                    duration: 5000,
                  });
                } else if (n >= 15) {
                  toast({
                    title: `Great roll: ${n}!`,
                    description: "Fortune favors the worthy!",
                    duration: 3000,
                  });
                }
              }}
            />
          </div>
          <div className="dark:hidden block">
            <D20Dice
              size="lg"
              onRoll={(n) => {
                if (n === 20) {
                  toast({
                    title: "LEGENDARY ROLL!",
                    description: "The dice gods smile upon you!",
                    duration: 5000,
                  });
                } else if (n >= 15) {
                  toast({
                    title: `Great roll: ${n}!`,
                    description: "Fortune favors the worthy!",
                    duration: 3000,
                  });
                }
              }}
              meshColour="#8839ef"
              textColour="#4c4f69"
              outlineColour="#e6e9ef"
            />
          </div>
        </div>

        {/* Grid of interactive dice - reduced to 3 for better performance */}
        <div className="flex flex-row flex-wrap justify-center mt-16 gap-12">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex justify-center">
              <div className="dark:block hidden">
                <D20Dice
                  size="md"
                />
              </div>
              <div className="dark:hidden block">
                <D20Dice
                  size="md"
                  meshColour="#8839ef"
                  textColour="#4c4f69"
                  outlineColour="#e6e9ef"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Single special dice */}
        <div className="flex justify-center mt-16">
          <div className="dark:block hidden">
            <D20Dice
              size="lg"
              onRoll={(n) => {
                if (n === 20) {
                  toast({
                    title: "LEGENDARY ROLL!",
                    description: "The dice gods smile upon you!",
                    duration: 5000,
                  });
                } else if (n >= 15) {
                  toast({
                    title: `Great roll: ${n}!`,
                    description: "Fortune favors the worthy!",
                    duration: 3000,
                  });
                }
              }}
            />
          </div>
          <div className="dark:hidden block">
            <D20Dice
              size="lg"
              onRoll={(n) => {
                if (n === 20) {
                  toast({
                    title: "LEGENDARY ROLL!",
                    description: "The dice gods smile upon you!",
                    duration: 5000,
                  });
                } else if (n >= 15) {
                  toast({
                    title: `Great roll: ${n}!`,
                    description: "Fortune favors the worthy!",
                    duration: 3000,
                  });
                }
              }}
              meshColour="#8839ef"
              textColour="#4c4f69"
              outlineColour="#e6e9ef"
            />
          </div>
        </div>
      </div>
    </div>
  )
}