'use client';

import { useFormStatus } from 'react-dom';
import { useState } from 'react';

import { deleteGuestbookEntries } from '@/lib/dataBaseActions';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { siteConfig } from '@/config/site';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenuLabel } from '@/components/ui/dropdown';

export default function Form({ entries }: any) {
  const [selectedInputs, setSelectedInputs] = useState<string[]>([]);

  const handleNormalClick = (checked: any, id: string, index: number) => {
    setSelectedInputs((prevInputs) =>
      checked
        ? [...prevInputs, id]
        : prevInputs.filter((inputId) => inputId !== id)
    );
  };

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        await deleteGuestbookEntries(selectedInputs);
      }}
      className="flex flex-col gap-4"
    >
      <div className="flex justify-center items-center">
        <DeleteButton isActive={selectedInputs.length !== 0} />
      </div>
      <div>
        {entries.map((entry: any, index: any) => (
          <div className="flex flex-row gap-2 w-full break-words" key={entry.id}>
            <Checkbox
              id={entry.id}
              checked={selectedInputs.includes(entry.id)}
              onCheckedChange={(e) => handleNormalClick(e.valueOf(), entry.id, index)}
              className="mt-1"
            />
            <div className="break-words">
              <span className={cn("mr-1 font-bold tracking-tight", entry.email.includes('@') ? "text-text" : siteConfig.codesStyles[entry.email as keyof typeof siteConfig.codesStyles])}>
                {entry.created_by}:
              </span>
              <span className="text-text">
                {entry.body}
              </span>
            </div>
          </div>
        ))}
      </div>
    </form>
  );
}

function DeleteButton({ isActive }: { isActive: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button
      disabled={pending}
      type="submit"
      className="w-fit"
      variant={isActive ? "destructive" : "default"}
      size="lg"
    >
      Delete Entries
    </Button>
  );
}