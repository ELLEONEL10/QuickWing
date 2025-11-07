import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { searchAirports, Airport } from '@/lib/api/airports';

export function useAirportAutocomplete(query: string) {
  const [debounced, setDebounced] = useState(query);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(query), 300); // 300 ms debounce
    return () => clearTimeout(id);
  }, [query]);

  const result = useQuery({
    queryKey: ['airports', debounced],
    queryFn: () => searchAirports(debounced),
    enabled: debounced.length > 0,
  });

  return result as {
    data?: Airport[];
    isPending: boolean;
    error: unknown;
  };
}
