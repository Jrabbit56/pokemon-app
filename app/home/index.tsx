"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import PokemonCard from "../components/PokemonCard";
import NavigationButton from "../components/NavigationButton";

export interface Pokemon {
  name: string;
  sprites: {
    other: {
      home: {
        front_default: string;
      };
    };
  };
  abilities: { ability: { name: string } }[];
  url: string;
}

// export default function Home() {

const Home = () => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [number, setNumber] = useState(0);
  const [activeSearch, setActiveSearch] = useState("");
  const [allPokemons, setAllPokemons] = useState<Pokemon[]>([]);

  useEffect(() => {
    let abortController = new AbortController();

    const loadPokemons = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/?limit=20&offset=${number}`
        );

        const pokemonResults = await Promise.all(
          res.data.results.map(async (pokemon: { url: string }) => {
            const pokemonRes = await axios.get(pokemon.url);
            return pokemonRes.data;
          })
        );

        setAllPokemons(pokemonResults);

        const filteredPokemons = pokemonResults.filter((pokemon: Pokemon) =>
          pokemon.name.toLowerCase().includes(activeSearch.toLowerCase())
        );

        setPokemons(filteredPokemons);
      } catch (error) {
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    loadPokemons();
    return () => abortController.abort();
  }, [number, activeSearch]);

  const prevPokemon = () => {
    if (number > 0) setNumber(number - 20);
  };

  const nextPokemon = () => {
    setNumber(number + 20);
  };

  const handleActiveSearch = (value: string) => {
    setActiveSearch(value);
    const filteredPokemons = allPokemons.filter((pokemon: Pokemon) =>
      pokemon.name.toLowerCase().includes(value.toLowerCase())
    );
    setPokemons(filteredPokemons);
  };

  return (
    <main className="p-4">
      {/* Search input */}
      <div className="input input-bordered flex items-center gap-2">
        <input
          type="text"
          className="grow"
          placeholder="Search Pokemon By Name"
          value={activeSearch}
          onChange={(e) => handleActiveSearch(e.target.value)}
        />
      </div>

      <br />

      {/* Pagination buttons */}
      <NavigationButton
        onPrevClick={prevPokemon}
        onNextClick={nextPokemon}
        number={number}
      />

      {/* Pokémon cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {pokemons.length > 0 &&
          pokemons.map((pokemon) => (
            <PokemonCard
              pokemon={pokemon}
              key={pokemon.name}
              detailUrl={`/detail/${pokemon.name}`}
            />
          ))}
      </div>
    </main>
  );
};

export default Home;
