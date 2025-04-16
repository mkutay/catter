import DoublePane from '@/components/doublePane';

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <DoublePane hideFollowLink>
      {children}
    </DoublePane>
  );
}