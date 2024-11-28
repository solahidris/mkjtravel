// pages/index.js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function PDFPage() {
  const router = useRouter();
  const { rwdata } = router.query; 
  const [data, setData] = useState(null);

  useEffect(() => {
    if (typeof rwdata === 'string') {
      try {
        const parsedData = JSON.parse(decodeURIComponent(rwdata));
        setData(parsedData);
      } catch (error) {
        console.error("Failed to parse rwdata:", error);
      }
    }
  }, [rwdata]);

  if (!data) return <p>Loading...</p>;


  return (
    <div className="overflow-hidden">
      <div className="w-[190mm] min-h-screen mx-auto p-[20mm] bg-white border border-gray-300 font-sans leading-relaxed break-after-page">
        
        {/* Header Banner and Logo */}
        <div className='relative top-[-20mm] left-[-20mm] w-[190mm]'>
          <img src="./header/topbanner.png" alt='banner' width={100} height={100} className='w-full absolute top-0 left-0'/>
          <img src="./header/logo.png" alt='banner' width={100} height={100} className='w-28 absolute top-28 right-10'/>
        </div>

        <div className="pt-10 flex flex-col gap-12">
          <h1 className="uppercase font-extrabold text-5xl">Travel Itinerary</h1>
          <div className='flex flex-col rounded-lg p-4 border border-gray-300'>
            <div className='grid grid-cols-4'><strong className='col-span-1 border-r mr-4'>Guide Name</strong><p>{data[0]}</p></div>
            <div className='grid grid-cols-4'><strong className='col-span-1 border-r mr-4'>Client Name</strong><p>{data[1]}</p></div>
            <div className='grid grid-cols-4'><strong className='col-span-1 border-r mr-4'>Package</strong><p>{data[3]}</p></div>
            <div className='grid grid-cols-4'><strong className='col-span-1 border-r mr-4'>No of Pax</strong><p>{data[3]}</p></div>
            <div className='grid grid-cols-4'><strong className='col-span-1 border-r mr-4'>Flight Detail</strong><p>{data[3]}</p></div>
          </div>
        </div>

        <div className="mt-10 flex flex-col rounded-lg p-4 border border-gray-300">
          <p className='text-center font-bold border-b pb-4'>Client Remark</p>
          <div dangerouslySetInnerHTML={{ __html:data[6] }} className='leading-5 pt-4 text-sm'/>
        </div>

        <div className="mt-10 flex flex-col rounded-lg p-4 border border-gray-300">
          <p className='text-center font-bold border-b pb-4'>Itenary Details</p>
          <div dangerouslySetInnerHTML={{ __html:data[6] }} className='leading-5 pt-4 text-sm'/>
          {data[10] &&
            Object.entries(data[10]).map(([key, value]) => (
              <p key={key}>
                <strong>Event {parseInt(key) + 1}:</strong> {value as string}
              </p>
            ))}
        </div>

      </div>
    </div>
  );
}