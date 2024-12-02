// pages/index.js
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { PiCloudSunBold } from "react-icons/pi";
import { FaPerson, FaChild, FaBabyCarriage, FaPlaneDeparture, FaPlaneArrival } from "react-icons/fa6";
import MkjGeneralBriefing from "@/components/MkjGeneralBriefing";

type Accommodation = {
  name: string;
  link: string;
  notes: string;
};
type ItineraryData = {
  guideName: string;
  clientName: string;
  package: string;
  clientPax: string;
  flightLink: string;
  remarks: string;
  dateStart: string;
  dateEnd: string;
  itenaryDetails: { [key: string]: string };
  // accomodation: string;
  accomodation: Accommodation[]; // Update to an array of Accommodation objects
  tickets: string;
};

export default function PDFPage() {
  const router = useRouter();
  const { rwdata } = router.query;
  const [data, setData] = useState<ItineraryData | null>(null);

  // Helper function to format the number of passengers
  const formatPax = (paxNumber: string | undefined) => {
    if (!paxNumber || isNaN(Number(paxNumber))) {
      return "Invalid passenger data";
    }
    const paxString = paxNumber.toString();
    const [adults, children, infants] = paxString.split("").map(Number);
    const totalPax = adults + children + infants;
    return (
      <div className="flex gap-4">
        <div className="flex gap-2 font-medium">
          <div className="flex items-center gap-0.5">
            {`${adults}`}
            <FaPerson className="w-4 h-4" />
          </div>
          {children > 0 && (
            <div className="flex items-center gap-0.5">
              {` ${children}`}
              <FaChild className="w-4 h-4" />
            </div>
          )}
          {infants > 0 && (
            <div className="flex items-center gap-2">
              {` ${infants}`}
              <FaBabyCarriage className="w-4 h-4" />
            </div>
          )}
        </div>
        <span>{`(${totalPax} pax)`}</span>
      </div>
    );
  };

  // Helper function to format date as DD/MM
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    return `${day}/${month}`;
  };

  // Helper function to add days to a date
  const addDays = (date: Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  useEffect(() => {
    if (typeof rwdata === "string") {
      try {
        const parsedData = JSON.parse(decodeURIComponent(rwdata));
        console.log("parsedData.accomodation:",parsedData.accomodation);
        // Parse the accomodation string into an array of objects
        const accomodationArray = parsedData.accomodation.split(",,,").map((item: string) => {
          const [name, link, notes] = item.split(",,");
          return { name, link, notes };
        });
        setData({ ...parsedData, accomodation: accomodationArray });
        // setData(parsedData);
        console.log("Parsed Data:", parsedData); // Verify the structure
      } catch (error) {
        console.error("Failed to parse rwdata:", error);
      }
    }
  }, [rwdata]);

  if (!data) return <p>Loading...</p>;

  const startDate = new Date(data.dateStart);
  const endDate = new Date(data.dateEnd);
  const numberOfDays =
    Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)) +
    1;

  return (
    <div className="overflow-hidden">
      <div className="w-full max-w-[200mm] min-h-screen mx-auto my-10 p-[10mm] bg-gray-50 border shadow-lg border-gray-300 font-sans leading-relaxed">
      
        {/* Header Banner and Logo */}
        <div className="relative top-[-60mm] left-[-10mm] w-[200mm] z-10 rounded-t-lg">
          <img
            src="./header/shibuya.png"
            // src="./header/doraemon.png"
            alt="banner"
            width={100}
            height={100}
            className="w-full absolute top-0 left-0 opacity-90 max-h-[320px] mt-[190px] object-bottom object-cover"
          />
        </div>
        <div className="relative top-[-60mm] left-[-10mm] w-[200mm] z-20">
          <img
            src="./header/logo.png"
            alt="banner"
            width={100}
            height={100}
            className="w-20 absolute top-[200px] right-10 rounded-lg"
          />
        </div>
        {/* <div className="relative top-[-20mm] left-[-10mm] w-[200mm] z-10">
          <img
            src="./header/topbanner.png"
            // src="./header/doraemon.png"
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
            className="w-28 absolute top-20 right-10"
          />
        </div> */}

        <div className="pt-20 flex flex-col gap-12">
        <h1 className="uppercase font-extrabold text-5xl text-white z-20" style={{ textShadow: '#4b5563 1px 0 10px' }}>Guide Guideline</h1>
          {/* <h1 className="uppercase font-extrabold text-5xl">Guide Guideline</h1> */}
          <div className="flex flex-col gap-2 rounded-lg p-4 border shadow-md bg-white border-gray-300 z-20">
            <div className="grid grid-cols-4">
              <strong className="col-span-1 border-r mr-4">Guide Name</strong>
              <p className="col-span-3">{data.guideName}</p>
            </div>
            <div className="grid grid-cols-4">
              <strong className="col-span-1 border-r mr-4">Client Name</strong>
              <p className="col-span-3">{data.clientName}</p>
            </div>
            <div className="grid grid-cols-4">
              <strong className="col-span-1 border-r mr-4">Package</strong>
              <div className="col-span-3 flex gap-2">
                <p>{`${data.package}`}</p>
                <div className="flex gap-1 items-center">
                  <p>{`(`}</p>
                  <PiCloudSunBold />
                  <p>{`${numberOfDays}H${numberOfDays - 1}M )`}</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-4">
              <strong className="col-span-1 border-r mr-4">No of Pax</strong>
              <p className="col-span-3">{formatPax(data.clientPax)}</p>
            </div>
            <div className="grid grid-cols-4">
              <strong className="col-span-1 border-r mr-4">
                Flight Detail
              </strong>
              <div className="col-span-3 flex flex-col gap-2">
                {data.flightLink.split(", ").map((flight, index) => {
                  const match = flight.match(/(.+?) \((https?:\/\/.+?)\) \[(.+?)\]/);
                  if (match) {
                    const [, name, link, type] = match;
                    return (
                      <div key={index} className={`flex gap-1 ${type === "Departure Domestic" && "border-t py-2 mt-2"}`}>
                        <div className="flex gap-2 items-center">
                          {type === "Departure" && <FaPlaneDeparture />}
                          {type === "Return" && <FaPlaneArrival />}
                          {type === "Departure Domestic" && <FaPlaneDeparture />}
                          {type === "Return Domestic" && <FaPlaneArrival />}
                          <span>{`${type}: ${name} -`}</span>
                        </div>
                        <a
                          href={link}
                          className="text-blue-700 underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {`link`}
                        </a>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
              
            </div>
          </div>
        </div>

        {/* Client Remarks */}
        <div className="mt-10 flex flex-col rounded-lg p-4 border shadow-md bg-white border-gray-300">
          <p className="text-center font-bold border-b pb-4">Client Remark</p>
          <div
            dangerouslySetInnerHTML={{ __html: data.remarks }}
            className="leading-5 pt-4 text-sm"
          />
        </div>

        {/* Tickets */}
        <div className="mt-10 flex flex-col rounded-lg p-4 border shadow-md bg-white border-gray-300">
          <p className="text-center font-bold border-b pb-4">{`Tickets`}</p>
          <div className="leading-5 pt-4 text-sm grid grid-cols-2 gap-4">
            {data.tickets.split(', ').map((ticket, index) => {
              // console.log(`Processing ticket: ${ticket}`); // Debugging line
              const match = ticket.match(/(.+?) \((.+?)\)/);
              if (match) {
                const [, name, link] = match;
                return (
                  <div key={index}>
                    <span>{`${name} - `}</span>
                    <a
                      href={link}
                      className="text-blue-700 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {`link`}
                    </a>
                  </div>
                );
              }
              return null; // Skip entries that don't match
            })}
          </div>

        </div>

        <div className="mt-10 flex flex-col rounded-lg p-4 border shadow-md bg-white border-gray-300">
          <p className="text-center font-bold border-b pb-4">Itenary Details</p>
          <div className="flex flex-col gap-4 mt-4">
            {data.itenaryDetails &&
              Object.entries(data.itenaryDetails).map(([key, value], index) => {
                const currentDate = addDays(startDate, index);
                return (
                  <div
                    key={key}
                    className={`flex ${index !== 0 && "border-t pt-4"}`}
                  >
                    <div className="flex flex-col pr-4 border-r">
                      <strong>Day {index + 1}</strong>
                      <p className="text-[10px]">{`${formatDate(
                        currentDate.toISOString()
                      )}`}</p>
                    </div>
                    <p className="pl-4">{value as string}</p>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Accomodation */}
        <div className="mt-10 flex flex-col rounded-lg p-4 border shadow-md bg-white border-gray-300">
          <p className="text-center font-bold border-b pb-4">Accomodation</p>
          
          <div className="leading-5 pt-4 text-sm">
            {data.accomodation.map((acc, index) => (
              <div key={index} className="pb-5">
                <p className="font-semibold">{`${index+1}. ${acc.name}`}</p>
                <a href={acc.link} className="text-blue-700 underline" target="_blank" rel="noopener noreferrer">
                  {acc.link}
                </a>
                <div className="border rounded-lg shadow p-4 mt-4">
                  <p className="font-bold underline pb-2">Notes</p>
                  <div dangerouslySetInnerHTML={{ __html: acc.notes }} className="break-words"/>
                </div>
              </div>
            ))}
          </div>

        </div>

        <hr className="my-10 "/>

        {/* MKJ General Briefing */}
        <div className="relative pb-[120px]">
          {/* REMOVE FOOTER - 1  */}
          <div className="mt-10 mb-40 flex flex-col p-4 border shadow-md bg-white border-gray-300 relative z-10">
          {/* <div className="mt-10 flex flex-col rounded-lg p-4 border shadow-md bg-white border-gray-300 relative z-10"> */}
            <p className="text-center font-bold border-b pb-4">MKJ General Briefing</p>
            <div className="leading-5 text-sm">
              <MkjGeneralBriefing/>
            </div>
          </div>

          {/* REMOVE FOOTER - 2 */}
          {/* Footer Banner and Logo */}
          <div className="absolute -bottom-100 -left-[10mm] w-full min-w-[200mm] z-0">
            <img
              src="./footer/slamdunk.png"
              alt="banner"
              className="w-full opacity-100 -mt-[240px] max-h-[404px] object-cover object-top"
            />
          </div>

        </div>

      </div>
    </div>
  );
}
