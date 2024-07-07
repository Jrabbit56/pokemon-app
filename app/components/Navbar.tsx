import Image from "next/image"

const Navbar = () => {
  return (
    <div className="py-5">
        <div className="max-w-[1500px] w-[90%] mx-auto flex justify-center">
        <figure>
            <Image 
                src="/logo.svg" 
                alt="pokemon logo" 
                width={200} 
                height={60} 
            />
        </figure>
        </div>
    </div>
  )
}

export default Navbar
