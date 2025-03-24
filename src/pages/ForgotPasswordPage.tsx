
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { validateEmail } from '@/lib/validation';
import { toast } from 'sonner';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      toast.error('Por favor, digite um endereço de e-mail válido');
      return;
    }
    
    setIsSubmitting(true);
    
    // In a real app, you would call an API to send a reset email
    // For this MVP, we'll just simulate the process
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      toast.success('Instruções de redefinição de senha enviadas');
    }, 1500);
  };

  return (
    <Layout hideFooter>
      <div className="min-h-screen flex items-center justify-center bg-conecta-pastel-mint/10 p-4">
        <div className="w-full max-w-md">
          <Link to="/login" className="inline-flex items-center text-conecta-green hover:text-conecta-green-dark transition-colors mb-6">
            <ArrowLeft size={16} className="mr-2" />
            <span>Voltar para Login</span>
          </Link>
          
          <div className="conecta-card animate-scale-in shadow-lg">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-conecta-earth-dark">Redefinir Senha</h1>
              <p className="text-conecta-earth">Digite seu e-mail para receber instruções de redefinição</p>
            </div>
            
            {isSubmitted ? (
              <div className="text-center">
                <div className="bg-conecta-green/10 text-conecta-green p-4 rounded-lg mb-6">
                  <p className="font-medium">Verifique seu e-mail</p>
                  <p className="text-sm mt-2">
                    Enviamos um link de redefinição de senha para {email}. Por favor, verifique sua caixa de entrada e siga as instruções.
                  </p>
                </div>
                <div className="mt-6">
                  <p className="text-sm text-muted-foreground mb-4">
                    Não recebeu o e-mail? Verifique sua pasta de spam ou tente novamente.
                  </p>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setIsSubmitted(false)}
                  >
                    Tentar Novamente
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
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
                      Enviando...
                    </span>
                  ) : (
                    "Enviar Instruções de Redefinição"
                  )}
                </Button>
                
                <div className="text-center pt-4">
                  <p className="text-sm text-muted-foreground">
                    Lembrou sua senha?{' '}
                    <Link 
                      to="/login" 
                      className="text-conecta-green hover:text-conecta-green-dark transition-colors"
                    >
                      Entrar
                    </Link>
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPasswordPage;
