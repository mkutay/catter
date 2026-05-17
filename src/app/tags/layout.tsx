import { DoublePane } from "@/components/double-pane";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  "use cache";
  return <DoublePane>{children}</DoublePane>;
}
