'use client';

import copy from 'copy-to-clipboard';
import { ClipboardIcon } from '@radix-ui/react-icons';

import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { siteConfig } from '@/config/site';

export default function CopyToClipboard({ text }: { text: string }) {
  const { toast } = useToast();

  return (
    <Button onClick={() => copy(siteConfig.url + '/' + text) && toast({
      title: "Copied to clipboard!",
    })} variant="outline" size="md">
      <ClipboardIcon className="mr-2 h-5 w-5" strokeWidth="0.3px" stroke="currentColor"/>Share
    </Button>
  );
}