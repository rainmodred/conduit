import Footer from './Footer/Footer';
import Header from './Header/Header';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps): JSX.Element {
  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  );
}
