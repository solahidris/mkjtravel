// pages/index.js
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { PiCloudSunBold } from "react-icons/pi";
import { FaPerson, FaChild, FaBabyCarriage } from "react-icons/fa6";

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
  accomodation: string; // Add this line
  tickets: string; // Add this line
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
        {`(${totalPax} pax)`}
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
        setData(parsedData);
        console.log("parsedData:", parsedData);
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

  console.log("data.tickets:", data.tickets);

  return (
    <div className="overflow-hidden">
      <div className="w-full max-w-[190mm] min-h-screen mx-auto p-[20mm] bg-gray-50 border shadow-lg border-gray-300 font-sans leading-relaxed">
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
            className="w-28 absolute top-28 right-20"
          />
        </div>

        <div className="pt-10 flex flex-col gap-12">
          <h1 className="uppercase font-extrabold text-5xl">Guide Guideline</h1>
          <div className="flex flex-col rounded-lg p-4 border shadow-md bg-white border-gray-300">
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
              {/* <a
                href={data.flightLink}
                className="col-span-3 text-blue-700 underline"
              >{`Flight detail - ${data.clientName} (link)`}</a> */}
              {/* <p className="col-span-3">{data.flightLink}</p> */}
              <div className="col-span-3">
                {data.flightLink.split(", ").map((flight, index) => {
                  const match = flight.match(/(.+?) \((https?:\/\/.+?)\)/);
                  if (match) {
                    const [ name, link] = match;
                    return (
                      <div key={index}>
                        <span>{`${name} `}</span>
                        <a
                          href={link}
                          className="text-blue-700 underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                        {`( link )`}
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
          <p className="text-center font-bold border-b pb-4">Tickets</p>
          {/* <p className="leading-5 pt-4 text-sm">{data.tickets}</p> */}
          <div className="leading-5 pt-4 text-sm">
            {data.tickets.split(', ').map((ticket, index) => {
              console.log(`Processing ticket: ${ticket}`); // Debugging line
              const match = ticket.match(/(.+?) \((.+?)\)/);
              if (match) {
                const [ name, link] = match;
                return (
                  <div key={index}>
                    <span>{`${name} `}</span>
                    <a
                      href={link}
                      className="text-blue-700 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {`( link )`}
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

        {/* <div className="mt-10 flex flex-col rounded-lg p-4 border shadow-md bg-white border-gray-300">
          <p className="text-center font-bold border-b pb-4">Accomodation</p>
          <div
            dangerouslySetInnerHTML={{ __html: data.remarks }}
            className="leading-5 pt-4 text-sm"
          />
        </div> */}
        {/* Accomodation */}
        <div className="mt-10 flex flex-col rounded-lg p-4 border shadow-md bg-white border-gray-300">
          <p className="text-center font-bold border-b pb-4">Accomodation</p>
          <p className="leading-5 pt-4 text-sm">{data.accomodation}</p>
          <div className="leading-5 pt-4 text-sm">
            {data.accomodation.split(', ').map((accomodation, index) => {
              console.log(`Processing ticket: ${accomodation}`); // Debugging line
              const match = accomodation.match(/(.+?) \((.+?)\)/);
              if (match) {
                const [ name, link] = match;
                return (
                  <div key={index}>
                    <span>{`${name} `}</span>
                    <a
                      href={link}
                      className="text-blue-700 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {`( link )`}
                    </a>
                  </div>
                );
              }
              return null; // Skip entries that don't match
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
