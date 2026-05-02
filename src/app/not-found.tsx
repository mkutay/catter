import DoublePane from "@/components/doublePane";
import { TypographyH1 } from "@/components/typography/headings";

export default function NotFound() {
  return (
    <DoublePane>
      <TypographyH1 className="mt-6 mb-8 text-primary">404</TypographyH1>
      <p className="leading-7 not-first:mt-6 text-lg">
        Oh no! This page does not exist.
      </p>
    </DoublePane>
  );
}
