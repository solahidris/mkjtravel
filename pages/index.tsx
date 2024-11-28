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
        <div className="text-center mb-5">
          <h1 className="mb-2.5">Travel Itinerary</h1>
          <p><strong>Name:</strong> {data[0]}</p>
          <p><strong>Contact:</strong> {data[1]}</p>
          <p><strong>Booking ID:</strong> {data[3]}</p>
        </div>

        <div className="mb-5">
          <h2 className="mb-2.5">Details</h2>
          <p><strong>Travel Date:</strong> {data[4]}</p>
          <p><strong>Package:</strong> {data[5]}</p>
          <p><strong>Participants:</strong>
            <div dangerouslySetInnerHTML={{ __html:data[6] }} />
          </p>
          <p><strong>Reference:</strong> {data[8]}</p>
        </div>

        <div className="mb-5">
          <h2 className="mb-2.5">Schedule</h2>
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