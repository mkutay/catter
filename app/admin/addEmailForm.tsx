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
import { addAdminFormSchema } from '@/config/schema';
import { addAdmin } from '@/lib/dataBaseActions';

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
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>
                Email
              </FormLabel>
              <FormControl>
                <Input
                  aria-label="Email"
                  placeholder="Email..."
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Email of the admin added.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>
                Name
              </FormLabel>
              <FormControl>
                <Input
                  aria-label="Name"
                  placeholder="Name..."
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Name of the admin added.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
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