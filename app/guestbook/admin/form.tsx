'use client';

import { useFormStatus } from 'react-dom';
import { useState } from 'react';

import { deleteGuestbookEntries } from '@/lib/dataBaseActions';

export default function Form({ entries }: any) {
  const [selectedInputs, setSelectedInputs] = useState<string[]>([]);

  const handleNormalClick = (checked: boolean, id: string, index: number) => {
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
    >
      <DeleteButton isActive={selectedInputs.length !== 0} />
      {entries.map((entry: any, index: any) => (
        <GuestbookEntry key={entry.id} entry={entry}>
          <input
            name={entry.id}
            type="checkbox"
            className="mr-2 w-4 h-4 border-[#bcc0cc] dark:border-[#45475a] bg-[#e6e9ef] dark:bg-[#181825] border"
            onChange={(e) => handleNormalClick(e.target.checked, entry.id, index)}
            checked={selectedInputs.includes(entry.id)}
          />
        </GuestbookEntry>
      ))}
    </form>
  );
}

function GuestbookEntry({ entry, children }: any) {
  return (
    <div className="w-full break-words items-center my-2">
      {children}
      <span className="text-[#d20f39] dark:text-[#f38ba8] mr-1">
        {entry.created_by}:
      </span>
      <span className="text-[#4c4f69] dark:text-[#cdd6f4]">
        {entry.body}
      </span>
    </div>
  );
}

const cx = (...classes: any) => classes.filter(Boolean).join(' ');

function DeleteButton({ isActive }: any) {
  const { pending } = useFormStatus();

  return (
    <button
      className={cx(
        'w-full items-center justify-center border border-[#bcc0cc] dark:border-[#45475a] bg-[#e6e9ef] dark:bg-[#181825] rounded-md p-4 not-prose inline-flex text-[#4c4f69] dark:text-[#cdd6f4] mb-8 transition-all',
        {
          'bg-[#d20f39] dark:bg-[#f38ba8]': isActive,
        }
      )}
      disabled={pending}
      type="submit"
    >
      Delete Entries
    </button>
  );
}