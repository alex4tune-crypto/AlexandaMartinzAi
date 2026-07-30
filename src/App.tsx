import React from 'react';
import { PlatformProvider, usePlatform } from './context/PlatformContext';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { PublicPortalModule } from './modules/public/PublicPortalModule';
import { MarketplaceModule } from './modules/marketplace/MarketplaceModule';
import { DashboardModule } from './modules/dashboard/DashboardModule';
import { CustomerAccountArea } from './modules/account/CustomerAccountArea';

const MainContent: React.FC = () => {
  const { currentSurface } = usePlatform();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans antialiased text-slate-900">
      <Header />
      <div className="flex-1 flex flex-col min-h-0">
        {currentSurface === 'portal' && <PublicPortalModule />}
        {currentSurface === 'marketplace' && <MarketplaceModule />}
        {currentSurface === 'dashboard' && <DashboardModule />}
        {currentSurface === 'account' && <CustomerAccountArea />}
      </div>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <PlatformProvider>
      <AuthProvider>
        <MainContent />
      </AuthProvider>
    </PlatformProvider>
  );
}
