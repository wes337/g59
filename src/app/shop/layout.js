import Image from "next/image";
import { Background } from "@/components/background";
import Menu from "./menu";

export default function RootLayout({ children }) {
  return (
    <>
      <div className="flex mt-[180px] m-auto w-[90vw] sm:w-[66vw] max-w-[900px] xl:w-[75vw] xl:max-w-[1200px] relative z-10">
        <div className="absolute top-0 left-[-22%] xl:left-[-17%]">
          <Menu />
        </div>
        {children}
      </div>
      <div className="wire-3 fixed z-[-1] bottom-[20%] md:bottom-0 w-[200vw] md:w-full drop-shadow-lg pointer-events-none">
        <Image src={`/images/wire-3.png`} width={3840} height={2160} alt="" />
      </div>
      <Background currentBackground={3} />
    </>
  );
}
