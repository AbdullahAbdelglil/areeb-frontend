import { Category } from '@/services/eventsApi';
import { Button } from '@/components/ui/button';

interface Props {
  categories: Category[];
  selectedCategoryId: number | null;
  onSelectCategory: (categoryId: number | null) => void;
}

export default function CategoryFilter({
  categories,
  selectedCategoryId,
}: Props) {
  return (
    <div className="flex flex-wrap gap-3 mb-6">
      <Button
        variant={selectedCategoryId === null ? 'default' : 'outline'}
        className={`px-4 py-1.5 text-sm rounded-full border transition-all duration-300 ease-in-out ${selectedCategoryId === null
            ? 'bg-[#1B263B] text-[#E0E1DD] border-[#415A77] hover:bg-[#415A77]'
            : 'bg-transparent text-[#778DA9] border-[#415A77] hover:bg-[#1B263B] hover:text-[#E0E1DD]'
          }`}
      >
        All
      </Button>

      {categories.map((category) => {
        const isSelected = selectedCategoryId === category.id;
        return (
          <Button
            key={category.id}
            variant={isSelected ? 'default' : 'outline'}
            className={`px-4 py-1.5 text-sm rounded-full border transition-all duration-300 ease-in-out ${isSelected
                ? 'bg-[#1B263B] text-[#E0E1DD] border-[#415A77] hover:bg-[#415A77]'
                : 'bg-transparent text-[#778DA9] border-[#415A77] hover:bg-[#1B263B] hover:text-[#E0E1DD]'
              }`}
          >
            {category.title}
          </Button>
        );
      })}
    </div>
  );
}
