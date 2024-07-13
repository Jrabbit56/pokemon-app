import Link from "next/link";
import React from "react";
import { Pokemon } from "../home";
import Image from "next/image";

type PokemonProps = {
  pokemon: Pokemon;
  detailUrl: string;
};

const PokemonCard = ({ detailUrl, pokemon }: PokemonProps) => {
  return (
    <Link href={detailUrl}>
      <div className="card w-full bg-base-100 shadow-xl cursor-pointer">
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
        </div>
      </div>
    </Link>
  );
};

export default PokemonCard;
