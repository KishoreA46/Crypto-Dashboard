

import { useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCryptoContext } from '@/lib/hooks/useCryptoContext';
import { debounce } from '@/lib/utils/formatting';

export function SearchBar() {
  const { searchQuery, setSearchQuery } = useCryptoContext();

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      setSearchQuery(query);
    }, 300),
    [setSearchQuery]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    debouncedSearch(value);
  };

  const handleClear = () => {
    setSearchQuery('');
  };

  return (
    <div className="w-full relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <Input
          type="text"
          placeholder="Search..."
          defaultValue={searchQuery}
          onChange={handleChange}
          className="pl-10 pr-10 text-sm"
          aria-label="Search cryptocurrencies by name or symbol"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
