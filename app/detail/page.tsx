'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/router';

interface Pokemon {
  name: string;
  sprites: {
    other: {
      home: {
        front_default: string;
      };
    };
  };
  abilities: { ability: { name: string } }[];
}

const PokemonDetail = () => {
  const router = useRouter();
  const { name } = router.query;
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
        setPokemon(res.data);
      } catch (error) {
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    if (name) {
      fetchPokemon();
    }
  }, [name,router]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      {pokemon && (
        <div className="card w-full bg-base-100 shadow-xl">
          <figure>
            <Image
              src={pokemon.sprites.other.home.front_default}
              alt={pokemon.name}
              width={500}
              height={500}
            />
          </figure>
          <div className="card-body">
            <h2 className="card-title text-center">{pokemon.name}</h2>
            <p>Abilities:</p>
            <ul>
              {pokemon.abilities.map((ability, index) => (
                <li key={index}>{ability.ability.name}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default PokemonDetail;
