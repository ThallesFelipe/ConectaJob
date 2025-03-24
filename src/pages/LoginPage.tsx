
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, LogIn } from 'lucide-react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { validateEmail } from '@/lib/validation';
import { toast } from 'sonner';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate input
    if (!email.trim() || !password.trim()) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }
    
    if (!validateEmail(email)) {
      toast.error('Por favor, insira um endereço de email válido');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const success = await login(email, password);
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
              <h1 className="text-3xl font-bold text-conecta-earth-dark">Bem-vindo de Volta</h1>
              <p className="text-conecta-earth">Entre na sua conta do ConectaJob</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Senha</Label>
                  <Link 
                    to="/forgot-password" 
                    className="text-sm text-conecta-green hover:text-conecta-green-dark transition-colors"
                  >
                    Esqueceu a senha?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="conecta-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <Button
                type="submit"
                className="conecta-button w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Entrando...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <LogIn size={16} className="mr-2" />
                    Entrar
                  </span>
                )}
              </Button>
              
              <div className="text-center pt-4">
                <p className="text-sm text-muted-foreground">
                  Não tem uma conta?{' '}
                  <Link 
                    to="/register" 
                    className="text-conecta-green hover:text-conecta-green-dark transition-colors"
                  >
                    Cadastre-se agora
                  </Link>
                </p>
              </div>
            </form>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Login de administrador: admin@conectajob.com / admin123
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;
