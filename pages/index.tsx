// pages/index.js
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { PiCloudSunBold } from "react-icons/pi";
import { IoTicket } from "react-icons/io5";
import { FaPerson, FaChild, FaBabyCarriage, FaPlaneDeparture, FaPlaneArrival, FaNoteSticky, FaCalendar, FaHouse, FaCar, FaStar } from "react-icons/fa6";
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
  transportation: Accommodation[]; // Update to an array of Transportation objects
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
      <div className="flex gap-2">
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
        console.log("parsedData.accomodation:", parsedData.accomodation);
  
        // Parse the accomodation string into an array of objects
        const accomodationArray = parsedData.accomodation.split("<<<").map((item: string) => {
          const [name, link, notes] = item.split(",,");
          return { name, link, notes };
        });
  
        // Parse the transportation string into an array of objects
        const transportationArray = parsedData.transportation.split("<<<").map((item: string) => {
          const [name, link, notes] = item.split(",,");
          return { name, link, notes };
        });
  
        setData({ ...parsedData, accomodation: accomodationArray, transportation: transportationArray });
        console.log("Parsed Data:", parsedData); // Verify the structure
      } catch (error) {
        console.error("Failed to parse rwdata:", error);
      }
    }
  }, [rwdata]);

  if (!data) return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-screen w-full bg-[#0b195a] text-white">
      <img
        src="./header/mkjlogo.png"
        alt="mkjlogo"
        width={100}
        height={100}
        className="w-28 lg:w-40"
      />
      <p className="font-mono">Loading...</p>
    </div>
  )

  const startDate = new Date(data.dateStart);
  const endDate = new Date(data.dateEnd);
  const numberOfDays =
    Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)) +
    1;

  return (
    <div className="overflow-hidden">
      <div className="w-full max-w-[200mm] min-h-screen mx-auto lg:my-10 p-[6mm] lg:p-[10mm] bg-[#0b195a] shadow-lg  font-sans leading-relaxed">
      
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

        <div className="relative z-20">
          <img
            src="./header/mkjlogo.png"
            alt="mkjlogo"
            width={100}
            height={100}
            className="w-28 lg:w-40 absolute top-0 right-0 rounded-lg"
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

        <div className="pt-10 lg:pt-20 flex flex-col gap-12">
        <div className="bg-gradient-to-t from-[#0b195a] to-transparent max-w-[99vw] w-full lg:w-[200mm] mt-[100px] lg:mt-[50px] -ml-[22px] lg:-ml-[38px] absolute min-h-[160px] z-20"/>
        <h1 className="uppercase font-extrabold text-6xl text-white text-center z-20" style={{ textShadow: '#000000 10px 4px 10px' }}>Guide Guideline</h1>
          {/* <h1 className="uppercase font-extrabold text-5xl">Guide Guideline</h1> */}
          <div className="flex flex-col gap-2 rounded-lg p-4  bg-white text-sm lg:text-base z-20">
            <div className="flex">
              <strong className="pr-2 min-w-[97px] lg:min-w-[108px]">Guide Name:</strong>
              <p className="col-span-3">{data.guideName}</p>
            </div>
            <div className="flex">
              <strong className="pr-2 min-w-[97px] lg:min-w-[108px]">Client Name:</strong>
              <p className="col-span-3">{data.clientName}</p>
            </div>
            <div className="flex">
              <strong className="pr-2 min-w-[97px] lg:min-w-[108px]">Package:</strong>
              <div className="col-span-3 flex gap-2">
                <p>{`${data.package}`}</p>
                <div className="flex gap-1 items-center">
                  <p>{`(`}</p>
                  <PiCloudSunBold />
                  <p>{`${numberOfDays}H${numberOfDays - 1}M )`}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <strong className="min-w-[89px] lg:min-w-[100px]">No of Pax:</strong>
              <p className="">{formatPax(data.clientPax)}</p>
            </div>
            <div className="flex lg:flex-row flex-col gap-2">
              <strong className="">
                Flight Detail:
              </strong>
              <div className="flex flex-col gap-2">
                {data.flightLink.split(", ").map((flight, index) => {
                  const match = flight.match(/(.+?) \((https?:\/\/.+?)\) \[(.+?)\]/);
                  if (match) {
                    const [, name, link, type] = match;
                    return (
                      <div key={index} className={`flex gap-1 ${type === "Domestic Departure" && "border-t border-gray-400 pt-2 mt-2"}`}>
                        <div className="flex gap-2 items-center">
                          {type === "Departure" && <FaPlaneDeparture />}
                          {type === "Return" && <FaPlaneArrival />}
                          {type === "Domestic Departure" && <FaPlaneDeparture />}
                          {type === "Domestic Return" && <FaPlaneArrival />}
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
        <div className="mt-10 flex flex-col rounded-lg p-4 bg-white ">
          <div className="flex items-center justify-center pb-4 border-b border-gray-400 gap-2">
            <FaNoteSticky/>
            <p className="text-center font-bold">Client Remark</p>
          </div>
          <div
            dangerouslySetInnerHTML={{ __html: data.remarks }}
            className="leading-5 pt-4 text-sm"
          />
        </div>

        {/* Tickets */}
        <div className="mt-10 flex flex-col rounded-lg p-4  bg-white ">
          <div className="flex items-center justify-center pb-4 border-b border-gray-400 gap-2">
            <IoTicket />
            <p className="text-center font-bold">Tickets</p>
          </div>
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

        <div className="mt-10 flex flex-col rounded-lg p-4  bg-white ">
          <div className="flex items-center justify-center pb-4 border-b border-gray-400 gap-2">
            <FaCalendar />
            <p className="text-center font-bold">Itenary Details</p>
          </div>
          <div className="flex flex-col gap-4 mt-4">
            {data.itenaryDetails &&
              Object.entries(data.itenaryDetails).map(([key, value], index) => {
                const currentDate = addDays(startDate, index);
                return (
                  <div
                    key={key}
                    className={`flex ${index !== 0 && "border-t border-gray-400  pt-4"}`}
                  >
                    <div className="flex flex-col pr-4 border-r border-gray-400 ">
                      <strong className="min-w-[46px]">Day {index + 1}</strong>
                      <p className="text-[10px]">{`${formatDate(
                        currentDate.toISOString()
                      )}`}</p>
                    </div>
                    <p className="pl-4 text-sm">{value as string}</p>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Accomodation */}
        <div className="mt-10 flex flex-col rounded-lg p-4  bg-white ">
          <div className="flex items-center justify-center pb-4 border-b border-gray-400 gap-2">
            <FaHouse />
            <p className="text-center font-bold">Accomodation</p>
          </div>
          <div className="leading-5 pt-4 text-sm">
            {Array.isArray(data.accomodation) && data.accomodation
              .filter(acc => acc.name || acc.link || acc.notes) // Filter out empty entries
              .map((acc, index) => (
                <div key={index} className="pb-5">
                  <p className="font-semibold">{`${index + 1}. ${acc.name}`}</p>
                  <a href={acc.link} className="text-blue-700 underline" target="_blank" rel="noopener noreferrer">
                    {acc.link}
                  </a>
                  <div className="border border-gray-400 rounded-lg drop-shadow-md p-4 mt-4">
                    <p className="font-bold underline pb-2">Notes</p>
                    <div dangerouslySetInnerHTML={{ __html: acc.notes }} className="break-words" />
                  </div>
                </div>
              ))}
          </div>

        </div>

        {/* Transportation */}
        <div className="mt-10 flex flex-col rounded-lg p-4  bg-white ">
          <div className="flex items-center justify-center pb-4 border-b border-gray-400 gap-2">
            <FaCar />
            <p className="text-center font-bold">Transportation</p>
          </div>
          
          <div className="leading-5 pt-4 text-sm">
            {Array.isArray(data.transportation) && data.transportation
              .filter(acc => acc.name || acc.link || acc.notes) // Filter out empty entries
              .map((acc, index) => (
                <div key={index} className="pb-5">
                  <p className="font-semibold">{`${index + 1}. ${acc.name}`}</p>
                  <a href={acc.link} className="text-blue-700 underline" target="_blank" rel="noopener noreferrer">
                    {acc.link}
                  </a>
                  <div className="border border-gray-400 rounded-lg drop-shadow-md p-4 mt-4">
                    <p className="font-bold underline pb-2">Notes</p>
                    <div dangerouslySetInnerHTML={{ __html: acc.notes }} className="break-words" />
                  </div>
                </div>
              ))}
          </div>

        </div>

        <hr className="my-10 border-cyan-300 border-[1.5px]"/>

        {/* MKJ General Briefing */}
        <div className="relative">
          {/* REMOVE FOOTER - 1  */}
          <div className="mt-10 mb-0 flex flex-col p-4 bg-white rounded-lg relative z-10">
          {/* <div className="mt-10 flex flex-col rounded-lg p-4  bg-white  relative z-10"> */}
            <div className="flex items-center justify-center pb-4 border-b border-gray-400 gap-2">
              <FaStar />
              <p className="text-center font-bold">MKJ General Briefing</p>
            </div>
            <div className="leading-5 text-sm rounded-lg">
              <MkjGeneralBriefing/>
            </div>
          </div>

          {/* REMOVE FOOTER - 2 */}
          {/* Footer Banner and Logo */}
          <div className="absolute min-w-[200mm] z-0 -ml-[10mm] -mt-[157.79px]">
            <img
              src="./footer/cyan.png"
              alt="banner"
              className="w-full opacity-100"
            />
          </div>

        </div>

      </div>
    </div>
  );
}
