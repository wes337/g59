import Image from "next/image";
import Link from "next/link";

export function TopBar() {
  return (
    <>
      <div className="fixed top-0 left-0 flex items-center justify-center w-full h-[148px] z-10 gap-8">
        <Link
          className="text-4xl tracking-wide hover:scale-[1.1] transition-all duration-200 drop-shadow-lg"
          href="/tour"
        >
          Tour
        </Link>
        <div className="w-[80px] md:w-[148px] h-full" />
        <Link
          className="text-4xl tracking-wide hover:scale-[1.1] transition-all duration-200 drop-shadow-lg"
          href="/shop"
        >
          Shop
        </Link>
      </div>
      <div className="fixed top-0 left-[50%] translate-x-[-50%] w-auto h-[148px] z-15 overflow-hidden">
        <div className="h-full w-full flex items-center justify-center hover:scale-[1.1] transition-all duration-200">
          <Link className="relative h-full w-auto" href="/">
            <Image
              className="w-full h-full object-contain"
              src={`/images/chain-base.png`}
              alt=""
              width={1000}
              height={1000}
            />
            <Image
              className="absolute bottom-[10%] left-[33%] w-[35%] drop-shadow-md spinner"
              src={`/images/chain-skull.png`}
              alt=""
              width={547}
              height={662}
            />
          </Link>
        </div>
      </div>
    </>
  );
}
