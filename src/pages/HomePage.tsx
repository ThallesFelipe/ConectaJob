import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, CheckCircle, Award, User, Briefcase } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import CategoryCard from '@/components/CategoryCard';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';

const HomePage: React.FC = () => {
  const { categories } = useApp();
  const { isAuthenticated } = useAuth();

  // Animation classes
  const fadeInClasses = "opacity-0 animate-fade-in";
  const slideInClasses = "transform -translate-x-4 opacity-0 animate-fade-in";

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-conecta-pastel-mint/50 to-conecta-pastel-peach/30 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
            <div className="w-full md:w-1/2 space-y-6">
              <div className={`${slideInClasses} [animation-delay:100ms]`}>
                <span className="inline-block bg-conecta-green/10 text-conecta-green font-medium px-4 py-1 rounded-full text-sm mb-4">
                  Encontre a combinação perfeita para seu projeto
                </span>
              </div>
              
              <h1 className={`text-4xl md:text-5xl font-bold text-conecta-earth-dark mb-4 ${slideInClasses} [animation-delay:200ms]`}>
                Conecte-se com os melhores freelancers para qualquer projeto
              </h1>
              
              <p className={`text-conecta-earth text-lg mb-8 ${slideInClasses} [animation-delay:300ms]`}>
                ConectaJob facilita encontrar e colaborar com profissionais qualificados em várias categorias. Publique um projeto ou ofereça seus serviços hoje!
              </p>
              
              <div className={`flex flex-col sm:flex-row gap-4 ${slideInClasses} [animation-delay:400ms]`}>
                <Link to={isAuthenticated ? "/post-project" : "/register"}>
                  <Button className="conecta-button w-full sm:w-auto">
                    {isAuthenticated ? "Publicar um Projeto" : "Junte-se Agora"}
                    <ArrowRight size={16} className="ml-2" />
                  </Button>
                </Link>
                <Link to="/projects">
                  <Button variant="outline" className="w-full sm:w-auto">
                    Explorar Projetos
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className={`w-full md:w-1/2 ${fadeInClasses} [animation-delay:500ms]`}>
              <div className="relative">
                <div className="absolute -z-10 w-72 h-72 bg-conecta-yellow/20 rounded-full blur-3xl top-0 left-0"></div>
                <div className="absolute -z-10 w-72 h-72 bg-conecta-green/20 rounded-full blur-3xl bottom-0 right-0"></div>
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80" 
                  alt="Pessoas colaborando" 
                  className="w-full h-auto rounded-xl shadow-lg object-cover"
                />
                
                <div className="absolute -bottom-6 -left-6 bg-white rounded-lg shadow-lg p-4 animate-float">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-10 h-10 bg-conecta-green/10 text-conecta-green rounded-full">
                      <CheckCircle size={18} />
                    </span>
                    <div>
                      <p className="font-medium">Ache freelancers!</p>
                      <p className="text-sm text-muted-foreground">Existe um profissinal para você!</p>
                    </div>
                  </div>
                </div>
                
                <div className="absolute -top-6 -right-6 bg-white rounded-lg shadow-lg p-4 animate-float [animation-delay:1s]">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-10 h-10 bg-conecta-yellow/10 text-conecta-yellow-dark rounded-full">
                      <Award size={18} />
                    </span>
                    <div>
                      <p className="font-medium">Trabalhe em projetos!</p>
                      <p className="text-sm text-muted-foreground">Contato direto com os empregadores.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">Qual serviço você está procurando hoje?</h2>
            <div className="flex gap-2 p-2 bg-conecta-pastel-mint/20 rounded-lg">
              <input 
                type="text" 
                placeholder="Buscar por serviços..." 
                className="conecta-input flex-1" 
              />
              <Link to="/projects">
                <Button className="conecta-button h-full">
                  <Search size={18} className="mr-2" />
                  Buscar
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-16 bg-conecta-pastel-mint/10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Categorias Populares</h2>
          <p className="text-conecta-earth text-center mb-12 max-w-2xl mx-auto">
            Explore nossas categorias de serviços mais populares para encontrar o talento de que você precisa
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Como o ConectaJob Funciona</h2>
          <p className="text-conecta-earth text-center mb-12 max-w-2xl mx-auto">
            Etapas simples para conectar, colaborar e criar juntos
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-lg border border-conecta-pastel-mint/30 bg-white">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-conecta-green/10 text-conecta-green mb-6">
                <User size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-4">Crie uma Conta</h3>
              <p className="text-conecta-earth">
                Cadastre-se como cliente para publicar projetos ou como freelancer para oferecer seus serviços. Crie um perfil que mostre suas habilidades e experiência.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 rounded-lg border border-conecta-pastel-mint/30 bg-white">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-conecta-yellow/10 text-conecta-yellow-dark mb-6">
                <Briefcase size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-4">Publique ou Encontre Projetos</h3>
              <p className="text-conecta-earth">
                Clientes podem publicar descrições detalhadas de projetos, enquanto freelancers podem navegar e se candidatar a projetos que correspondam às suas habilidades e interesses.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 rounded-lg border border-conecta-pastel-mint/30 bg-white">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-conecta-earth/10 text-conecta-earth mb-6">
                <CheckCircle size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-4">Colabore e Complete</h3>
              <p className="text-conecta-earth">
                Conecte-se com seu match, discuta detalhes e trabalhe juntos para concluir o projeto com sucesso. Deixe avaliações e comentários depois.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link to="/register">
              <Button className="conecta-button">
                Começar
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </Layout>
  );
};

export default HomePage;
