
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, User, Briefcase, ArrowRight } from 'lucide-react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { validateEmail, validatePassword, validateUsername } from '@/lib/validation';
import { toast } from 'sonner';

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'client' | 'freelancer'>('client');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if role is specified in the URL
    const params = new URLSearchParams(location.search);
    const roleParam = params.get('role');
    if (roleParam === 'client' || roleParam === 'freelancer') {
      setRole(roleParam);
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate input
    if (!username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }
    
    if (!validateUsername(username)) {
      toast.error('Nome de usuário deve ter pelo menos 3 caracteres');
      return;
    }
    
    if (!validateEmail(email)) {
      toast.error('Por favor, insira um endereço de email válido');
      return;
    }
    
    if (!validatePassword(password)) {
      toast.error('A senha deve ter pelo menos 8 caracteres');
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const success = await register(username, email, password, role);
      if (success) {
        navigate('/');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout hideFooter>
      <div className="min-h-screen flex items-center justify-center bg-conecta-pastel-mint/10 p-4">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-flex items-center text-conecta-green hover:text-conecta-green-dark transition-colors mb-6">
            <ArrowLeft size={16} className="mr-2" />
            <span>Voltar para o Início</span>
          </Link>
          
          <div className="conecta-card animate-scale-in shadow-lg">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-conecta-earth-dark">Criar uma Conta</h1>
              <p className="text-conecta-earth">Junte-se à comunidade ConectaJob hoje</p>
            </div>
            
            <Tabs value={role} onValueChange={(v) => setRole(v as 'client' | 'freelancer')} className="mb-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="client" className="flex items-center gap-2">
                  <Briefcase size={16} />
                  <span>Sou Cliente</span>
                </TabsTrigger>
                <TabsTrigger value="freelancer" className="flex items-center gap-2">
                  <User size={16} />
                  <span>Sou Freelancer</span>
                </TabsTrigger>
              </TabsList>
              <TabsContent value="client" className="pt-4">
                <p className="text-sm text-muted-foreground mb-6">
                  Cadastre-se como cliente para publicar projetos e contratar freelancers talentosos.
                </p>
              </TabsContent>
              <TabsContent value="freelancer" className="pt-4">
                <p className="text-sm text-muted-foreground mb-6">
                  Cadastre-se como freelancer para mostrar suas habilidades e encontrar projetos.
                </p>
              </TabsContent>
            </Tabs>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Nome de Usuário</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Seu nome"
                  className="conecta-input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  minLength={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  className="conecta-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="conecta-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
                <p className="text-xs text-muted-foreground">
                  Senha deve ter pelo menos 8 caracteres
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  className="conecta-input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              
              <Button
                type="submit"
                className="conecta-button w-full mt-6"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Criando conta...
                  </span>
                ) : (
                  <span className="flex items-center">
                    Criar Conta
                    <ArrowRight size={16} className="ml-2" />
                  </span>
                )}
              </Button>
              
              <div className="text-center pt-4">
                <p className="text-sm text-muted-foreground">
                  Já tem uma conta?{' '}
                  <Link 
                    to="/login" 
                    className="text-conecta-green hover:text-conecta-green-dark transition-colors"
                  >
                    Entrar
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RegisterPage;
