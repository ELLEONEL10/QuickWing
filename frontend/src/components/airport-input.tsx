'use client';
import { useState } from 'react';
import { useAirportAutocomplete } from '@/hooks/useAirportAutocomplete';
import { Airport } from '@/lib/api/airports';

interface Props {
  label: string;
  onSelect: (airport: Airport) => void;
}

export default function AirportInput({ label, onSelect }: Props) {
  const [value, setValue] = useState('');
  const { data = [], isPending } = useAirportAutocomplete(value);

  return (
    <div className="relative w-60">
      <input
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder={label}
        className="w-full border p-2 rounded"
      />
      {value && (
        <ul className="absolute z-10 w-full bg-white border rounded max-h-56 overflow-auto">
          {isPending && <li className="p-2 text-gray-500">Loading…</li>}
          {!isPending && data.length === 0 && (
            <li className="p-2 text-gray-500">No matches</li>
          )}
          {data.map(a => (
            <li
              key={a.id}
              className="p-2 hover:bg-blue-100 cursor-pointer"
              onClick={() => {
                onSelect(a);
                setValue(`${a.iata} - ${a.city}`);
              }}
            >
              <strong>{a.iata}</strong> — {a.city}, {a.country}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
