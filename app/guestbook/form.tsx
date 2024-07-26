'use client';

import { useRef } from 'react';
import { useFormStatus } from 'react-dom';

import { saveGuestbookEntry } from '@/lib/dataBaseActions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
    >
      Sign!
    </Button>
  );
}