import DoublePane from '@/components/doublePane';

export default function NotFound() {
  return (
    <DoublePane>
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        404
      </h1>
      <p className="leading-7 [&:not(:first-child)]:mt-6 text-lg">
        Oh no! This page does not exist.
      </p>
    </DoublePane>
  );
}