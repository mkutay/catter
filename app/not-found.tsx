import DoublePane from '@/components/doublePane';

export default function NotFound() {
  return (
    <DoublePane>
      <h1>
        404
      </h1>
      <hr/>
      <p className="text-2xl">
        Oh no! This page does not exist.
      </p>
    </DoublePane>
  );
}