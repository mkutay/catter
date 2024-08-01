'use client';

import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { addAdmin } from '@/lib/dataBaseActions';
import { addAdminFormSchema } from '@/config/schema';

// Component to add admins that can control the website
export default function AddEmailForm() {
  const form = useForm<z.infer<typeof addAdminFormSchema>>({
    resolver: zodResolver(addAdminFormSchema),
    defaultValues: {
      email: "",
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof addAdminFormSchema>) => {
    await addAdmin({ email: values.email, name: values.name });
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <FormLabel>
          Add Admin
        </FormLabel>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  aria-label="Email"
                  placeholder="Email..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  aria-label="Name"
                  placeholder="Name..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormDescription className="not-prose">
          Add admin to control the website.
        </FormDescription>
        <Button
          variant="secondary"
          size="default"
          type="submit"
          className="w-fit"
        >
          Add
        </Button>
      </form>
    </Form>
  );
}