'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { saveGuestbookEntry } from '@/lib/dataBaseActions';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

const colors = [
  { label: 'Rosewater', value: 'rosewater'},
  { label: 'Flamingo', value: 'flamingo'},
  { label: 'Pink', value: 'pink'},
  { label: 'Mauve', value: 'mauve'},
  { label: 'Red', value: 'red'},
  { label: 'Maroon', value: 'maroon'},
  { label: 'Peach', value: 'peach'},
  { label: 'Yellow', value: 'yellow'},
  { label: 'Green', value: 'green'},
  { label: 'Teal', value: 'teal'},
  { label: 'Sky', value: 'sky'},
  { label: 'Sapphire', value: 'sapphire'},
  { label: 'Blue', value: 'blue'},
  { label: 'Lavender', value: 'lavender'},
  { label: 'Text', value: 'text'},
];

const PopOverFormSchema = z.object({
  color: z.string({
    required_error: 'Please select a colour.',
  }),
  username: z.string().min(1, {
    message: 'Username must be at least 1 character.',
  }).max(30, {
    message: 'Username must be at most 30 characters.',
  }),
  message: z.string().min(2, {
    message: 'Message must be at least 2 characters.'
  }).max(500, {
    message: 'Message must be at most 500 characters.'
  }),
});

export function GuestbookDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm" className="w-fit">
          Customize
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Customize Your Guestbook Entry</DialogTitle>
        </DialogHeader>
        <GuestBookDialogForm/>
      </DialogContent>
    </Dialog>
  );
}

export function GuestBookDialogForm() {
  const form = useForm<z.infer<typeof PopOverFormSchema>>({
    resolver: zodResolver(PopOverFormSchema),
    defaultValues: {
      color: "",
      username: "",
      message: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof PopOverFormSchema>) => {
    await saveGuestbookEntry({
      message: values.message,
      username: values.username,
      color: values.color,
    });
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="lg:space-y-4 space-y-2">
        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Colour</FormLabel>
              <Popover modal={true}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-[200px] justify-between",
                        !field.value && "text-description"
                      )}
                    >
                      {field.value
                        ? colors.find(
                            (color) => color.value === field.value
                          )?.label
                        : "Select colour"}
                      <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-70" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search colour..."
                      className="h-9"
                    />
                    {/* <ScrollArea className="max-h-[300px]"> */}
                    <CommandList>
                      <CommandEmpty>No colour found.</CommandEmpty>
                      <CommandGroup className="py-1">
                        {colors.map((color) => (
                          <CommandItem
                            value={color.label}
                            key={color.value}
                            onSelect={() => {
                              form.setValue("color", color.value);
                            }}
                            className={`text-${color.value}`}
                          >
                            {color.label}
                            <CheckIcon
                              className={cn(
                                "ml-auto h-4 w-4",
                                color.value === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                    {/* </ScrollArea> */}
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                This is the <span className={`text-${field.value}`}>colour</span> that your name will be rendered as.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  aria-label="Your displayed name"
                  placeholder="Enter a name to be displayed..."
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea
                  aria-label="Your message"
                  placeholder="Type your message here..."
                  className="h-24"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This will be your guestbook entry.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}