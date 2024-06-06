'use client';

import { useRef } from 'react';
import { saveGuestbookEntry } from '@/app/lib/dataBaseActions';
import { useFormStatus } from 'react-dom';

export default function Form() {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      className="relative"
      ref={formRef}
      action={async (formData) => {
        await saveGuestbookEntry(formData);
        formRef.current?.reset();
      }}
    >
      <div className="flex">
        <input
          aria-label="Your message"
          placeholder="Your message..."
          name="entry"
          type="text"
          required
          className="px-4 py-2 flex w-full border mr-1 border-[#bcc0cc] dark:border-[#45475a] bg-[#e6e9ef] dark:bg-[#181825] rounded-md text-[#4c4f69] dark:text-[#cdd6f4]"
        />
        <SubmitButton/>
      </div>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="flex items-center justify-center px-4 py-2 ml-1 border border-[#bcc0cc] dark:border-[#45475a] bg-[#e6e9ef] dark:bg-[#181825] text-[#4c4f69] dark:text-[#cdd6f4] rounded-md"
      disabled={pending}
      type="submit"
    >
      Sign
    </button>
  );
}