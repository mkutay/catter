'use client';

import { useRef } from 'react';
import { useFormStatus } from 'react-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from "@/components/ui/textarea"
import { saveGuestbookEntry } from '@/lib/dataBaseActions';

export default function Form() {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await saveGuestbookEntry(formData);
        formRef.current?.reset();
      }}
    >
      <div className="flex flex-row gap-2">
        <Input
          aria-label="Your message"
          placeholder="Your message..."
          name="entry"
          type="text"
          required
        />
        <SubmitButton/>
      </div>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      variant="secondary"
      size="md"
      disabled={pending}
      type="submit"
      className="text-base w-fit"
    >
      Sign!
    </Button>
  );
}

export function GuestBookPopOverForm() {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await saveGuestbookEntry(formData);
        formRef.current?.reset();
      }}
    >
      <div className="flex flex-col gap-2 justify-center items-center">
        <Input
          aria-label="Enter a code"
          id="code-code"
          placeholder="Enter a code..."
          type="text"
          name="code"
          required
        />
        <Input
          aria-label="Your displayed name"
          id="code-name"
          placeholder="Enter a name to be displayed..."
          type="text"
          name="name"
          required
        />
        <Textarea
          aria-label="Your message"
          placeholder="Type your message here..."
          name="entry"
          required
          className="h-24"
        />
        <SubmitButton/>
      </div>
    </form>
  );
}