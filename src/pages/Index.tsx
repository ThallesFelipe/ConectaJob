import Layout from '@/components/Layout';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-conecta-earth-dark">
            Bem-vindo ao <span className="text-conecta-green">ConectaJob</span>
          </h1>
          <p className="text-xl mb-8 text-conecta-earth">
            Conectamos clientes e freelancers de forma simples e segura
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button asChild className="conecta-button py-6 px-8 text-lg">
              <Link to="/projects">Explorar Projetos</Link>
            </Button>
            <Button asChild className="conecta-button-secondary py-6 px-8 text-lg">
              <Link to="/freelancers">Encontrar Freelancers</Link>
            </Button>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-lg shadow-lg p-8 mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-conecta-earth-dark">Como funciona?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-conecta-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-conecta-green text-2xl font-bold">1</span>
                </div>
                <h3 className="font-medium mb-2">Publique seu projeto</h3>
                <p className="text-conecta-earth">Descreva o que você precisa e defina seu orçamento</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-conecta-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-conecta-green text-2xl font-bold">2</span>
                </div>
                <h3 className="font-medium mb-2">Receba propostas</h3>
                <p className="text-conecta-earth">Freelancers qualificados irão apresentar suas propostas</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-conecta-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-conecta-green text-2xl font-bold">3</span>
                </div>
                <h3 className="font-medium mb-2">Escolha e contrate</h3>
                <p className="text-conecta-earth">Selecione o profissional ideal para o seu projeto</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
