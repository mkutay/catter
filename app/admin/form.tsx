'use client';

import { useFormStatus } from 'react-dom';
import { useState, useEffect } from 'react';
import { deleteGuestbookEntries } from '@/app/lib/dataBaseActions';

export default function Form({ entries }: any) {
  const [selectedInputs, setSelectedInputs] = useState<string[]>([]);
  const [startShiftClickIndex, setStartShiftClickIndex] = useState<number>(0);
  const [isShiftKeyPressed, setIsShiftKeyPressed] = useState(false);
  const [isCommandKeyPressed, setIsCommandKeyPressed] = useState(false);

  useEffect(() => {
    const keyDownHandler = ({ key }: any) => {
      if (key === 'Shift') {
        setIsShiftKeyPressed(true);
      }
      if (key === 'Meta' || key === 'Control') {
        setIsCommandKeyPressed(true);
      }
    };
    const keyUpHandler = ({ key }: any) => {
      if (key === 'Shift') {
        setIsShiftKeyPressed(false);
      }
      if (key === 'Meta' || key === 'Control') {
        setIsCommandKeyPressed(false);
      }
    };

    window.addEventListener('keydown', keyDownHandler);
    window.addEventListener('keyup', keyUpHandler);

    return () => {
      window.removeEventListener('keydown', keyDownHandler);
      window.removeEventListener('keyup', keyUpHandler);
    };
  }, []);

  const handleNormalClick = (checked: boolean, id: string, index: number) => {
    setSelectedInputs((prevInputs) =>
      checked
        ? [...prevInputs, id]
        : prevInputs.filter((inputId) => inputId !== id)
    );
    setStartShiftClickIndex(index);
  };

  const handleCommandClick = (id: string) => {
    setSelectedInputs((prevInputs) =>
      prevInputs.includes(id)
        ? prevInputs.filter((inputId) => inputId !== id)
        : [...prevInputs, id]
    );
  };

  const handleShiftClick = (index: number, checked: boolean) => {
    const startIndex = Math.min(startShiftClickIndex!, index);
    const endIndex = Math.max(startShiftClickIndex!, index);

    setSelectedInputs((prevInputs) => {
      const newSelection = entries
        .slice(startIndex, endIndex + 1)
        .map((item: any) => item.id);

      if (checked) {
        const combinedSelection = Array.from(
          new Set([...prevInputs, ...newSelection])
        );
        return combinedSelection;
      } else {
        return prevInputs.filter((inputId) => !newSelection.includes(inputId));
      }
    });
  };

  const handleCheck = (checked: boolean, id: string, index: number) => {
    if (isCommandKeyPressed) {
      handleCommandClick(id);
    } else if (isShiftKeyPressed && startShiftClickIndex !== null) {
      handleShiftClick(index, checked);
    } else {
      handleNormalClick(checked, id, index);
    }
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    id: string,
    index: number
  ) => {
    if (event.key === 'Enter') {
      // Check if the checkbox was already selected
      const isChecked = selectedInputs.includes(id);

      // Toggle the checkbox
      handleCheck(!isChecked, id, index);
    }
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
            className="mr-2 w-4 h-4 bg-[#e6e9ef] dark:bg-[#181825] border-[#bcc0cc] dark:border-[#45475a] border"
            onChange={(e) => handleCheck(e.target.checked, entry.id, index)}
            onKeyDown={(e) => handleKeyDown(e, entry.id, index)}
            checked={selectedInputs.includes(entry.id)}
          />
        </GuestbookEntry>
      ))}
    </form>
  );
}

function GuestbookEntry({ entry, children }: any) {
  return (
    <div className="flex flex-col space-y-1 mb-4">
      <div className="w-full break-words items-center flex">
        {children}
        <span className="text-[#d20f39] dark:text-[#f38ba8] mr-1">
          {entry.created_by}:
        </span>
        <span className="text-[#4c4f69] dark:text-[#cdd6f4]">
          {entry.body}
        </span>
      </div>
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