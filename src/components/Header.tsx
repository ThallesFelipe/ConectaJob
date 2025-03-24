
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Search, Bell } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

interface HeaderProps {
  onSearch?: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { currentUser, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    } else {
      navigate(`/projects?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="glass-morphism border-b border-conecta-green/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center gap-2 text-conecta-green-dark font-bold text-xl md:text-2xl transition-all hover:text-conecta-green"
            >
              <img src="/favicon.ico" alt="ConectaJob Logo" className="h-8 w-8" />
              ConectaJob
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-conecta-earth-dark hover:text-conecta-green transition-colors">
                Início
              </Link>
              <Link to="/projects" className="text-conecta-earth-dark hover:text-conecta-green transition-colors">
                Projetos
              </Link>
              <Link to="/freelancers" className="text-conecta-earth-dark hover:text-conecta-green transition-colors">
                Freelancers
              </Link>
              {isAuthenticated && currentUser?.role === 'client' && (
                <Link to="/post-project" className="text-conecta-earth-dark hover:text-conecta-green transition-colors">
                  Publicar Projeto
                </Link>
              )}
            </nav>

            {/* Search Bar */}
            <div className="hidden md:flex-1 md:flex md:max-w-md md:mx-6">
              <form onSubmit={handleSearch} className="w-full relative">
                <Input
                  type="text"
                  placeholder="O que você está procurando?"
                  className="conecta-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  variant="ghost" 
                  className="absolute right-0 top-0 h-full text-conecta-earth-dark hover:text-conecta-green hover:bg-transparent"
                >
                  <Search size={18} />
                </Button>
              </form>
            </div>

            {/* Authentication Buttons - Desktop */}
            <div className="hidden md:flex items-center gap-4">
              {isAuthenticated ? (
                <div className="flex items-center gap-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                        <Avatar className="h-10 w-10 bg-conecta-yellow/20">
                          <AvatarImage src={currentUser?.profileImage} />
                          <AvatarFallback className="bg-conecta-green text-white">
                            {getInitials(currentUser?.username || 'U')}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <div className="flex items-center p-2">
                        <div className="ml-2 space-y-1">
                          <p className="text-sm font-medium">{currentUser?.username}</p>
                          <p className="text-xs text-muted-foreground">{currentUser?.email}</p>
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/profile">
                          <User className="mr-2 h-4 w-4" />
                          <span>Perfil</span>
                        </Link>
                      </DropdownMenuItem>
                      {currentUser?.role === 'admin' && (
                        <DropdownMenuItem asChild>
                          <Link to="/admin">
                            <Bell className="mr-2 h-4 w-4" />
                            <span>Painel Admin</span>
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={logout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Sair</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <>
                  <Button variant="outline" onClick={() => navigate('/login')}>
                    Entrar
                  </Button>
                  <Button className="conecta-button" onClick={() => navigate('/register')}>
                    Cadastrar
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden" 
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>

          {/* Mobile Menu */}
          <div
            className={cn(
              "md:hidden space-y-4 py-4",
              isMenuOpen ? "block animate-fade-in" : "hidden"
            )}
          >
            <form onSubmit={handleSearch} className="relative mb-4">
              <Input
                type="text"
                placeholder="O que você está procurando?"
                className="conecta-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button 
                type="submit" 
                size="icon" 
                variant="ghost" 
                className="absolute right-0 top-0 h-full text-conecta-earth-dark hover:text-conecta-green hover:bg-transparent"
              >
                <Search size={18} />
              </Button>
            </form>
            
            <div className="flex flex-col space-y-3">
              <Link 
                to="/" 
                className="text-conecta-earth-dark hover:text-conecta-green px-3 py-2 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Início
              </Link>
              <Link 
                to="/projects" 
                className="text-conecta-earth-dark hover:text-conecta-green px-3 py-2 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Projetos
              </Link>
              <Link 
                to="/freelancers" 
                className="text-conecta-earth-dark hover:text-conecta-green px-3 py-2 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Freelancers
              </Link>
              {isAuthenticated && currentUser?.role === 'client' && (
                <Link 
                  to="/post-project" 
                  className="text-conecta-earth-dark hover:text-conecta-green px-3 py-2 rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Publicar Projeto
                </Link>
              )}
            </div>

            <div className="pt-4 border-t border-conecta-green/10">
              {isAuthenticated ? (
                <div className="flex flex-col space-y-3">
                  <Link
                    to="/profile"
                    className="flex items-center text-conecta-earth-dark hover:text-conecta-green px-3 py-2 rounded-md transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User size={16} className="mr-2" />
                    Perfil
                  </Link>
                  {currentUser?.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="flex items-center text-conecta-earth-dark hover:text-conecta-green px-3 py-2 rounded-md transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Bell size={16} className="mr-2" />
                      Painel Admin
                    </Link>
                  )}
                  <Button
                    variant="ghost"
                    className="flex items-center justify-start text-destructive hover:text-destructive hover:bg-destructive/10 px-3 py-2 rounded-md transition-colors"
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                  >
                    <LogOut size={16} className="mr-2" />
                    Sair
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => {
                      navigate('/login');
                      setIsMenuOpen(false);
                    }}
                  >
                    Entrar
                  </Button>
                  <Button 
                    className="conecta-button w-full" 
                    onClick={() => {
                      navigate('/register');
                      setIsMenuOpen(false);
                    }}
                  >
                    Cadastrar
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
