import Link from "next/link";

export default function EmailSubButton() {
  return (
    <div className="grid sm:grid-rows-1 sm:grid-flow-col gap-4 prose-p:my-0 place-content-center">
      <div className="flex justify-center items-center sm:col-auto">
        <p className="text-lg">
          Subscribe to my newsletter to get updates on new posts and occasional email special posts.
        </p>
      </div>
      <div className="flex justify-center items-center">
        <button
          className="text-lg font-semibold rounded-2xl p-4 not-prose border border-[#bcc0cc] dark:border-[#45475a] bg-[#e6e9ef] dark:bg-[#181825] text-[#8839ef] dark:text-[#cba6f7]"
        >
          <Link href="https://mkutay.substack.com/subscribe">
            Subscribe!
          </Link>
        </button>
      </div>
    </div>
  );
}