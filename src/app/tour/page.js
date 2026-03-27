import axios from "axios";
import { Background } from "@/components/background";
import Wire from "@/components/wire";
import TourList from "./tour-list";
import TourWidget from "./tour-widget";

/**
 * Toggle this to switch between the custom tour list and the Seated embed widget.
 *   false = custom tour list using Seated API data (default)
 *   true  = raw Seated embed widget
 */
const USE_WIDGET = false;

/** Set to true to preview the layout with fake Grey Day 2026 dates */
const USE_TEST_DATA = false;

const TEST_TOURS = [
  { id: "test-1", attributes: { "starts-at": "2026-07-10T20:00:00", "starts-at-short": "Jul 10", "formatted-address": "West Palm Beach, FL", "venue-name": "iTHINK Financial Amphitheatre", "details": "Grey Day 2026", "promoted-on-sale-date-name": "VIP" } },
  { id: "test-2", attributes: { "starts-at": "2026-07-11T20:00:00", "starts-at-short": "Jul 11", "formatted-address": "Tampa, FL", "venue-name": "MIDFLORIDA Credit Union Amphitheatre", "details": "Grey Day 2026", "promoted-on-sale-date-name": "VIP" } },
  { id: "test-3", attributes: { "starts-at": "2026-07-14T20:00:00", "starts-at-short": "Jul 14", "formatted-address": "Atlanta, GA", "venue-name": "Lakewood Amphitheatre", "details": "Grey Day 2026", "promoted-on-sale-date-name": "" } },
  { id: "test-4", attributes: { "starts-at": "2026-07-16T20:00:00", "starts-at-short": "Jul 16", "formatted-address": "Nashville, TN", "venue-name": "Ascend Amphitheater", "details": "Grey Day 2026", "promoted-on-sale-date-name": "" } },
  { id: "test-5", attributes: { "starts-at": "2026-07-18T20:00:00", "starts-at-short": "Jul 18", "formatted-address": "Charlotte, NC", "venue-name": "PNC Music Pavilion", "details": "Grey Day 2026", "promoted-on-sale-date-name": "VIP" } },
  { id: "test-6", attributes: { "starts-at": "2026-07-21T20:00:00", "starts-at-short": "Jul 21", "formatted-address": "Holmdel, NJ", "venue-name": "PNC Bank Arts Center", "details": "Grey Day 2026", "promoted-on-sale-date-name": "" } },
  { id: "test-7", attributes: { "starts-at": "2026-07-22T20:00:00", "starts-at-short": "Jul 22", "formatted-address": "Wantagh, NY", "venue-name": "Jones Beach Theater", "details": "Grey Day 2026", "promoted-on-sale-date-name": "VIP" } },
  { id: "test-8", attributes: { "starts-at": "2026-07-24T20:00:00", "starts-at-short": "Jul 24", "formatted-address": "Mansfield, MA", "venue-name": "Xfinity Center", "details": "Grey Day 2026", "promoted-on-sale-date-name": "" } },
  { id: "test-9", attributes: { "starts-at": "2026-07-25T20:00:00", "starts-at-short": "Jul 25", "formatted-address": "Hartford, CT", "venue-name": "Xfinity Theatre", "details": "Grey Day 2026", "promoted-on-sale-date-name": "" } },
  { id: "test-10", attributes: { "starts-at": "2026-07-28T20:00:00", "starts-at-short": "Jul 28", "formatted-address": "Clarkston, MI", "venue-name": "Pine Knob Music Theatre", "details": "Grey Day 2026", "promoted-on-sale-date-name": "VIP" } },
  { id: "test-11", attributes: { "starts-at": "2026-07-30T20:00:00", "starts-at-short": "Jul 30", "formatted-address": "Tinley Park, IL", "venue-name": "Hollywood Casino Amphitheatre", "details": "Grey Day 2026", "promoted-on-sale-date-name": "" } },
  { id: "test-12", attributes: { "starts-at": "2026-08-01T20:00:00", "starts-at-short": "Aug 1", "formatted-address": "Denver, CO", "venue-name": "Fiddler's Green Amphitheatre", "details": "Grey Day 2026", "promoted-on-sale-date-name": "" } },
  { id: "test-13", attributes: { "starts-at": "2026-08-04T20:00:00", "starts-at-short": "Aug 4", "formatted-address": "Los Angeles, CA", "venue-name": "Hollywood Bowl", "details": "Grey Day 2026", "promoted-on-sale-date-name": "VIP" } },
  { id: "test-14", attributes: { "starts-at": "2026-08-06T20:00:00", "starts-at-short": "Aug 6", "formatted-address": "Phoenix, AZ", "venue-name": "Ak-Chin Pavilion", "details": "Grey Day 2026", "promoted-on-sale-date-name": "" } },
  { id: "test-15", attributes: { "starts-at": "2026-08-08T20:00:00", "starts-at-short": "Aug 8", "formatted-address": "Dallas, TX", "venue-name": "Dos Equis Pavilion", "details": "Grey Day 2026", "promoted-on-sale-date-name": "" } },
  { id: "test-16", attributes: { "starts-at": "2026-08-09T20:00:00", "starts-at-short": "Aug 9", "formatted-address": "Houston, TX", "venue-name": "The Cynthia Woods Mitchell Pavilion", "details": "Grey Day 2026", "promoted-on-sale-date-name": "VIP" } },
  { id: "test-17", attributes: { "starts-at": "2026-08-11T20:00:00", "starts-at-short": "Aug 11", "formatted-address": "New Orleans, LA", "venue-name": "Bold Sphere Music at Champions Square", "details": "Grey Day 2026", "promoted-on-sale-date-name": "" } },
];

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
  const tours = USE_WIDGET ? [] : USE_TEST_DATA ? TEST_TOURS : await getTours();

  return (
    <>
      <div className="md:w-[95vw] md:max-w-[1100px] m-auto mt-[120px] md:mt-[200px]">
        {USE_WIDGET ? (
          <TourWidget />
        ) : (
          <div className="relative z-10">
            <div className="absolute w-full h-full bg-black/75 z-0 pointer-events-none" />
            <div className="relative z-10">
              <TourList tours={tours} />
            </div>
          </div>
        )}
      </div>
      <Background currentBackground={0} />
      <Wire wire={1} />
      <Wire wire={2} />
      <Wire wire={3} />
    </>
  );
}
