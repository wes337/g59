import { Background } from "@/components/background";
import Menu from "./menu";
import Wire from "@/components/wire";

export default function RootLayout({ children }) {
  return (
    <>
      <div className="flex mt-[172px] m-auto w-[90vw] sm:w-[66vw] max-w-[900px] xl:w-[75vw] xl:max-w-[1200px] relative z-10">
        <div className="absolute top-0 left-[-22%] xl:left-[-17%]">
          <Menu />
        </div>
        {children}
      </div>
      <Wire wire={1} />
      <Wire wire={2} />
      <Wire wire={3} />
      <Background currentBackground={3} />
    </>
  );
}
