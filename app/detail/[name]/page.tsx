"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import NavigationButton from "@/app/components/NavigationButton";

interface PokemonDetail {
  name: string;
  id: number;
  sprites: {
    other: {
      home: {
        front_default: string;
      };
    };
  };
  abilities: { ability: { name: string } }[];
  types: { type: { name: string } }[];
  stats: { stat: { name: string }; base_stat: number }[];
  url: string;
}

export default function Detail({ params }: { params: { name: string } }) {
  const router = useRouter();
  const [pokemonData, setPokemonData] = useState<PokemonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [pokemonIndex, setPokemonIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${params.name}`
        );
        setPokemonData(response.data);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [params.name]);

  // PREVIOUS POKEMON
  const fetchPreviousPokemon = async () => {
    if (pokemonData) {
      try {
        const response = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${pokemonData?.id - 1}`
        );
        setPokemonData(response.data);
        setPokemonIndex(pokemonIndex - 1);
        router.push(`/detail/${response.data.name}`); // Update the params.name state with the next pokemon name
      } catch (error) {
        setError(error as Error);
      }
    }
  };

  // NEXT POKEMON
  const fetchNextPokemon = async () => {
    try {
      if (pokemonData) {
        const response = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${pokemonData?.id + 1}`
        );
        setPokemonData(response.data);
        setPokemonIndex(pokemonIndex + 1);
        router.push(`/detail/${response.data.name}`); // Update the params.name state with the next pokemon name
      }
    } catch (error) {
      setError(error as Error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading data: {error.message}</p>;

  return (
    <div className="container mx-auto p-4 ">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex flex-col items-center">
          <div className="card bg-base-200 shadow-2xl">
            <figure>
              {pokemonData && pokemonData.sprites.other.home.front_default ? (
                <Image
                  className="w-auto"
                  src={pokemonData.sprites.other.home.front_default}
                  alt={pokemonData.name}
                  width={500}
                  height={500}
                />
              ) : (
                <p>Loading image...</p>
              )}
            </figure>
          </div>
          <br />
          <div>
            <h1 className="text-4xl font-bold mb-2">{pokemonData?.name}</h1>
          </div>

          <div className="flex items-center space-x-4 mb-4">
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-auto lg:grid-cols-auto gap-4">
              {pokemonData?.types.map(
                (typ: { type: { name: string } }, idx: number) => (
                  <li key={idx}>
                    <span className="text-center text-xl font-bold">
                      {typ.type.name}
                    </span>
                  </li>
                )
              )}
            </ul>
          </div>

          <div className="w-full">
            {pokemonData?.stats.map((stat, idx) => (
              <div key={idx} className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">{stat.stat.name}</span>
                  <span className="text-sm font-medium">{stat.base_stat}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 relative">
                  <div
                    className="bg-blue-600 h-full rounded-full"
                    style={{ width: `${(stat.base_stat / 255) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <NavigationButton
            className="w-full"
            onPrevClick={fetchPreviousPokemon}
            onNextClick={fetchNextPokemon}
            buttonClassName="bg-blue-500 text-white px-4 py-2 rounded-lg"
            number={pokemonIndex}
          />
          <button
            className="bg-gray-500 text-white px-4 py-2 mt-4 rounded-lg"
            onClick={() => router.push("/")}
          >
            Return
          </button>
        </div>
      </div>
    </div>
  );
}
