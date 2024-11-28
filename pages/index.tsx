// pages/index.js
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

type ItineraryData = {
  days: string[];
  [key: number]: string; // Assuming other data fields are indexed by numbers
};

export default function PDFPage() {
  const router = useRouter();
  const { rwdata } = router.query;
  const [data, setData] = useState<ItineraryData | null>(null);

  // Helper function to format the number of passengers
  const formatPax = (paxNumber: number | undefined) => {
    if (typeof paxNumber !== 'number') {
      return 'Invalid passenger data';
    }
    
    const paxString = paxNumber.toString();
    const [adults, children, infants] = paxString.split('').map(Number);
    const totalPax = adults + children + infants;
    return `${adults} adults${children > 0 ? ` + ${children} children` : ''}${infants > 0 ? ` + ${infants} infant` : ''} (${totalPax} pax)`;
  };

  useEffect(() => {
    if (typeof rwdata === "string") {
      try {
        const parsedData = JSON.parse(decodeURIComponent(rwdata));
        setData(parsedData);
        console.log("parsedData:", parsedData);
      } catch (error) {
        console.error("Failed to parse rwdata:", error);
      }
    }
  }, [rwdata]);

  if (!data) return <p>Loading...</p>;

  return (
    <div className="overflow-hidden">
      <div className="w-full max-w-[190mm] min-h-screen mx-auto p-[20mm] bg-white border border-gray-300 font-sans leading-relaxed break-after-page">
        {/* Header Banner and Logo */}
        <div className="relative top-[-20mm] left-[-20mm] w-[190mm]">
          <img
            src="./header/topbanner.png"
            alt="banner"
            width={100}
            height={100}
            className="w-full absolute top-0 left-0"
          />
          <img
            src="./header/logo.png"
            alt="banner"
            width={100}
            height={100}
            className="w-28 absolute top-28 right-10"
          />
        </div>

        <div className="pt-10 flex flex-col gap-12">
          <h1 className="uppercase font-extrabold text-5xl">
            Travel Itinerary
          </h1>
          <div className="flex flex-col rounded-lg p-4 border border-gray-300">
            <div className="grid grid-cols-4">
              <strong className="col-span-1 border-r mr-4">Guide Name</strong>
              <p className="col-span-3">{data.days[1]}</p>
            </div>
            <div className="grid grid-cols-4">
              <strong className="col-span-1 border-r mr-4">Client Name</strong>
              <p className="col-span-3">{data.days[2]}</p>
            </div>
            <div className="grid grid-cols-4">
              <strong className="col-span-1 border-r mr-4">Package</strong>
              <p className="col-span-3">{data.days[3]}</p>
            </div>
            <div className="grid grid-cols-4">
              <strong className="col-span-1 border-r mr-4">No of Pax</strong>
              {data.days[4] && <p className="col-span-3">{formatPax(Number(data.days[4]))}</p>}
            </div>
            <div className="grid grid-cols-4">
              <strong className="col-span-1 border-r mr-4">
                Flight Detail
              </strong>
              <a href={data.days[5]} className="col-span-3 text-blue-700 underline">{`Flight detail - ${data.days[2]} (link)`}</a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col rounded-lg p-4 border border-gray-300">
          <p className="text-center font-bold border-b pb-4">Client Remark</p>
          <div
            dangerouslySetInnerHTML={{ __html: data.days[6] }}
            className="leading-5 pt-4 text-sm"
          />
        </div>

        <div className="mt-10 flex flex-col rounded-lg p-4 border border-gray-300">
          <p className="text-center font-bold border-b pb-4">Itenary Details</p>
          {data[10] &&
            Object.entries(data.days[10]).map(([key, value]) => (
              <p key={key}>
                <strong>Event {parseInt(key) + 1}:</strong> {value as string}
              </p>
            ))}
        </div>
      </div>
    </div>
  );
}