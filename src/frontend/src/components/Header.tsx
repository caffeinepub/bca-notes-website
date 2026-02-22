import { useNavigate, useRouterState } from '@tanstack/react-router';
import { BookOpen, FileText, HelpCircle, Shield, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LoginButton from './LoginButton';
import { useIsCallerAdmin } from '../hooks/useQueries';

export default function Header() {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const { data: isAdmin } = useIsCallerAdmin();

  const navItems = [
    { path: '/notes', label: 'Notes', icon: BookOpen },
    { path: '/syllabus', label: 'Syllabus', icon: FileText },
    { path: '/pdfs', label: 'PDFs', icon: File },
    { path: '/pyq', label: 'PYQ', icon: HelpCircle },
  ];

  if (isAdmin) {
    navItems.push({ path: '/admin', label: 'Admin', icon: Shield });
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <button
            onClick={() => navigate({ to: '/' })}
            className="flex items-center gap-2 font-bold text-xl text-primary hover:opacity-80 transition-opacity"
          >
            <BookOpen className="h-6 w-6" />
            <span>BCA Hub</span>
          </button>
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path || (item.path === '/notes' && currentPath === '/');
              return (
                <Button
                  key={item.path}
                  variant={isActive ? 'secondary' : 'ghost'}
                  onClick={() => navigate({ to: item.path })}
                  className="gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              );
            })}
          </nav>
        </div>
        <LoginButton />
      </div>
    </header>
  );
}
