'use client';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { searchFlights, Flight } from '@/lib/api/flights';


type Form = { origin: string; destination: string; date: string };

export default function FlightSearchPage() {
  const { register, handleSubmit } = useForm<Form>();
  const search = useMutation({ mutationFn: searchFlights });

  const onSubmit = handleSubmit(vals => search.mutate(vals));

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl mb-4 font-semibold">Flight search</h1>

      <form onSubmit={onSubmit} className="flex flex-wrap gap-4 mb-8">
        <input {...register('origin')}      placeholder="Origin IATA"      className="border p-2 rounded"/>
        <input {...register('destination')} placeholder="Destination IATA" className="border p-2 rounded"/>
        <input {...register('date')}        type="date"                    className="border p-2 rounded"/>
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Search</button>
      </form>

      {search.isPending && <p>Loading…</p>}
      {search.isError   && <p className="text-red-600">{`${search.error}`}</p>}

      {search.data && (
        <ul className="space-y-3">
          {search.data.map((f: Flight) => (
            <li key={f.flight.iata} className="border rounded p-4">
              <strong>{f.airline.name}</strong> — {f.flight.iata || f.flight.number}<br/>
              {f.departure.airport} ➜ {f.arrival.airport}<br/>
              {new Date(f.departure.scheduled).toLocaleString()} → {new Date(f.arrival.scheduled).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
