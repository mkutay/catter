import Link from "next/link";

export default function EmailSubButton() {
  return (
    <div className="grid grid-rows-1 sm:grid-flow-col gap-4 prose-p:my-0">
      <p className="text-lg col-auto sm:text-left text-center">
        <span className="text-[#8839ef] dark:text-[#cba6f7] underline">Subscribe</span>
        <span> to my newsletter to get updates on new posts and occasional email special posts.</span>
      </p>
      <div className="flex justify-center items-center">
        <button
          className="text-xl font-bold tracking-tight rounded-2xl p-4 not-prose border border-[#bcc0cc] dark:border-[#45475a] bg-[#e6e9ef] dark:bg-[#181825] text-[#8839ef] dark:text-[#cba6f7]"
        >
          <Link href="https://mkutay.substack.com/subscribe">
            Subscribe!
          </Link>
        </button>
      </div>
    </div>
  );
}