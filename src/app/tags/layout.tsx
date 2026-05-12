import { DoublePane } from "@/components/double-pane";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <DoublePane>{children}</DoublePane>;
}
