import { type ReactNode, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import Home from '@/pages/home';
import Projects from '@/pages/projects';
import Admin from '@/pages/admin';
import Contact from '@/pages/contact';
import ProjectDetail from '@/pages/project-detail';
import AboutUs from '@/pages/about-us';
import { PageTransition } from '@/components/animations';
import { DataProvider } from '@/context/DataContext';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

function Router() {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <RoutedErrorBoundary>
      <PageTransition keyProp={location}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/projects" component={Projects} />
          <Route path="/projects/:slug" component={ProjectDetail} />
          <Route path="/admin" component={Admin} />
          <Route path="/contact" component={Contact} />
          <Route path="/about-us" component={AboutUs} />
          <Route component={NotFound} />
        </Switch>
      </PageTransition>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <DataProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <Router />
          </WouterRouter>
        </DataProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
