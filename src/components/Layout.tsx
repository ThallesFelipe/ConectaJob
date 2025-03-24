
import React from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  hideFooter?: boolean;
  onSearch?: (query: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, hideFooter = false, onSearch }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header onSearch={onSearch} />
      <main className="flex-1">
        {children}
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
};

export default Layout;
