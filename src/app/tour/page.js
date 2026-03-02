import axios from "axios";
import { Background } from "@/components/background";
import Wire from "@/components/wire";
import Tour from "./tour";
import TourMap from "./map";

export const revalidate = 30;

async function getTours() {
  const response = await axios.get(
    "https://cdn.seated.com/api/tour/7a8dfbf3-1b50-4887-940c-7abec1d7406f?include=tour-events"
  );

  const tours = response.data?.included || [];

  tours.sort((a, b) => {
    return (
      new Date(a.attributes["starts-at"]).getTime() -
      new Date(b.attributes["starts-at"]).getTime()
    );
  });

  return tours;
}

export default async function ToursPage() {
  const tours = await getTours();

  return (
    <>
      <div className="md:w-[95vw] md:max-w-[1100px] m-auto mt-[148px]">
        <TourMap />
        <div className="flex flex-col gap-6 z-10 relative">
          <div className="absolute w-full h-full bg-black/75 z-0" />
          {tours.map((tour, index) => {
            return <Tour key={tour.id} tour={tour} index={index} />;
          })}
        </div>
      </div>
      <Background currentBackground={0} />
      <Wire wire={1} />
      <Wire wire={2} />
      <Wire wire={3} />
    </>
  );
}
