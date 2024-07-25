import Link from 'next/link';

export default function EmailSubButton() {
  return (
    <div className="grid grid-rows-1 gap-2 prose-p:my-0">
      <p className="text-lg col-auto">
        <span className="text-[#8839ef] dark:text-[#cba6f7] underline">Subscribe</span>
        <span> to my newsletter to get updates on new posts and email only specials.</span>
      </p>
      <div className="flex justify-center items-center">
        <button
          className="text-lg font-bold tracking-tight rounded-xl p-3 not-prose border border-[#bcc0cc] dark:border-[#45475a] bg-[#e6e9ef] dark:bg-[#181825] text-[#8839ef] dark:text-[#cba6f7]"
        >
          <Link href="https://mkutay.substack.com/subscribe">
            Subscribe!
          </Link>
        </button>
      </div>
    </div>
  );
}