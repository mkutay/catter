'use client';

import copy from 'copy-to-clipboard';

import { siteConfig } from '@/config/site';
import { Button } from '@/components/button';
import { useToast } from './ui/use-toast';
import { ClipboardCopyIcon, ClipboardIcon } from '@radix-ui/react-icons';

export default function CopyToClipboard({ text }: { text: string }) {
  const { toast } = useToast();

  return (
    <Button onClick={() => copy(siteConfig.url + '/' + text) && toast({
      title: "Copied To Clipboard!",
    })} variant="outline" className="text-md">
      <ClipboardIcon className="mr-2"/>Share
    </Button>
  );
}