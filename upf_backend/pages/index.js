// updated index.js (Next.js version)
import { useEffect, useRef } from "react";
import Quagga from "@ericblade/quagga2";
import Image from "next/image"; // Import Next.js Image component
import upfLogo from "../public/upf-unwrapped-logo2.png"; // Logo in /public

export default function Home() {
  const videoRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined" && videoRef.current) {
      Quagga.init(
        {
          inputStream: {
            name: "Live",
            type: "LiveStream",
            target: videoRef.current,
            constraints: {
              facingMode: "environment",
            },
          },
          decoder: {
            readers: ["ean_reader", "code_128_reader", "code_39_reader"],
          },
        },
        function (err) {
          if (err) {
            console.error("Quagga init error:", err);
            return;
          }
          console.log("Quagga initialized successfully.");
          Quagga.start();
        }
      );

      Quagga.onDetected((result) => {
        alert(`Scanned Barcode: ${result.codeResult.code}`);
        console.log("Barcode detected:", result.codeResult.code);
        Quagga.stop();
      });

      return () => {
        Quagga.stop();
      };
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* Logo and Heading */}
      <header className="w-full text-center py-6">
        <div>
        <Image 
          src={upfLogo} 
          alt="UPF Unwrapped Logo" 
          width={200} 
          height={100} 
          className="mx-auto"
        />

        </div>
        <h1 className="text-4xl font-bold text-primary">UPF Unwrapped</h1>
          <p className="text-lg text-secondary">Scan. Learn. Eat Better.</p>
      </header>
      

      {/* Camera Scanner Section */}
      <div className="w-full max-w-md p-4 bg-white rounded-lg shadow-lg">
        <div ref={videoRef} id="camera" className="w-full h-64 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  );
}
