import Image from "next/image";

import CopyToClipboard from "@/components/copyToClipboard";
import DoublePane from "@/components/doublePane";
import { Skeleton } from "@/components/ui/skeleton";
import blurred from '@/public/images/blurred.jpg';

export default function Loading() {
  const lineSkeletons = Array.from({ length: 6 }, (_, i) => (
    <Skeleton key={i} className="h-6 w-full" />
  ));
  lineSkeletons.push(
    <Skeleton key={lineSkeletons.length + 1} className="h-6 w-2/3" />
  )

  const tagSkeletons = Array.from({ length: 3 }, (_, i) => (
    <Skeleton key={i} className="h-5 w-[7ch]" />
  ));

  return (
    <>
      <div className="bg-primary w-full h-fit py-6 lg:space-y-16 space-y-10">
        <div className="lg:max-w-6xl max-w-prose mx-auto px-4 space-y-2">
          <Skeleton className="h-6 w-[12ch]" />
          <div className="flex flex-row gap-4">
            {tagSkeletons}
          </div>
        </div>
        <div className="lg:max-w-6xl max-w-prose px-4 mx-auto text-primary-foreground lg:space-y-4 space-y-2">
          <Skeleton className="lg:h-12 lg:w-5/6 w-full h-10" />
          <Skeleton className="h-6 w-2/3 [&:not(:first-child)]:mt-6" />
        </div>
      </div>
      <DoublePane loadingState>
        <div>
          <div className="my-6"><Image
            alt="blurred image"
            src={blurred}
            sizes="100vw"
            style={{ width: "100%", height: "auto" }}
            className="max-w-4xl mx-auto lg:rounded-md rounded-sm lg:shadow-md shadow-sm"
          /></div>
          <div className="my-4 flex flex-row items-center gap-4 justify-end text-foreground text-lg">
            <CopyToClipboard text="Copy" />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {lineSkeletons}
        </div>
      </DoublePane>
    </>
  );
}