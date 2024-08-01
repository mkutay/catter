'use client';

import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { deleteAdmins } from '@/lib/dataBaseActions';

export default function DeleteAdminForm({ admins }: { admins: { id: number, email: string, name: string }[] }) {
  const deleteAdminFormSchema = z.object({
    items: z.array(z.number()).refine((value) => value.some((item) => item), {
      message: 'You have to select at least one item.',
    }),
  });

  const form = useForm<z.infer<typeof deleteAdminFormSchema>>({
    resolver: zodResolver(deleteAdminFormSchema),
    defaultValues: {
      items: [],
    },
  });

  const onSubmit = async (values: z.infer<typeof deleteAdminFormSchema>) => {
    await deleteAdmins(values.items);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="items"
          render={() => (
            <FormItem>
              <FormLabel className="text-foreground">Delete Admins</FormLabel>
              <FormDescription>
                Delete the admins that you do not want to control the website.
              </FormDescription>
              {admins.map((admin) => (
                <FormField
                  key={admin.id}
                  control={form.control}
                  name="items"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={admin.id}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            id={admin.id.toString()}
                            className="mt-[3px]"
                            checked={field.value?.includes(admin.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, admin.id])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== admin.id
                                    )
                                  )
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          {admin.email} — {admin.name}
                        </FormLabel>
                      </FormItem>
                    )
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" size="default" variant="destructive">Delete Admins</Button>
      </form>
    </Form>
  );
}