
import React from 'react';
import { Search, Filter, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Category } from '@/types/models';

interface FilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  minBudget: number;
  maxBudget: number;
  setMinBudget: (minBudget: number) => void;
  setMaxBudget: (maxBudget: number) => void;
  onSearch: () => void;
  categories: Category[];
}

const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  minBudget,
  maxBudget,
  setMinBudget,
  setMaxBudget,
  onSearch,
  categories
}) => {
  return (
    <div className="w-full bg-white rounded-lg shadow-sm p-4 mb-6 animate-slide-down">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Input
            type="text"
            placeholder="Buscar projetos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="conecta-input pr-10"
            onKeyDown={(e) => e.key === 'Enter' && onSearch()}
          />
          <Search 
            size={18} 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
          />
        </div>
        
        <Select
          value={selectedCategory}
          onValueChange={setSelectedCategory}
        >
          <SelectTrigger className="w-full md:w-[180px] conecta-input">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as Categorias</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.name}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full md:w-auto flex items-center gap-2">
              <Filter size={16} />
              Orçamento
              <ChevronDown size={14} className="ml-auto" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-4" align="end">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <Label>Faixa de Orçamento</Label>
                  <div className="text-sm">
                    R$ {minBudget} - R$ {maxBudget}
                  </div>
                </div>
                <Slider
                  defaultValue={[minBudget, maxBudget]}
                  max={10000}
                  step={100}
                  onValueChange={(values) => {
                    setMinBudget(values[0]);
                    setMaxBudget(values[1]);
                  }}
                  className="my-4"
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>
        
        <Button className="conecta-button md:w-auto" onClick={onSearch}>
          Buscar
        </Button>
      </div>
    </div>
  );
};

export default FilterBar;
