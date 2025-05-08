import { useEffect, useRef, useState } from "react";
import Quagga from "@ericblade/quagga2";
import Image from "next/image";
import upfLogo from "../public/upf-unwrapped-logo2.png";
import Link from "next/link";

// Nick’s modular helpers (merged setup)
import { getNovaDescription } from "./getNovaDescription"; // changed to an object lookup, since this is faster, doesn't require if statements, and prevents errors by automatically catching unexpected values
import { fetchProductData } from "./fetchProductData"; // modularised version of fetchProductData
import ProductDetails from "./productDetails";
import BarcodeControls from "./controlComponents"; // updated to match your default export

export default function Home() {
  const videoRef = useRef(null);
  const [scannedBarcode, setScannedBarcode] = useState(null);
  const [productData, setProductData] = useState(null); // Store product data in state
  const [errorMessage, setErrorMessage] = useState(null);
  const [isScanning, setIsScanning] = useState(true); // New: tracks if camera should be visible; changing so that the camera switches off once scan is loaded since this is distracting
  const [manualBarcode, setManualBarcode] = useState(""); // New: State for manual barcode input
  const [foundIngredients, setFoundIngredients] = useState([]); // Store found UPF risk ingredients

  useEffect(() => {
    if (typeof window !== "undefined" && videoRef.current) {
      Quagga.init(
        {
          inputStream: {
            name: "Live",
            type: "LiveStream",
            target: videoRef.current,
          },
          decoder: {
            readers: ["ean_reader", "ean_8_reader", "upc_reader", "upc_e_reader"], // added support for multiple barcode formats 
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

      // improved quagga onDetected function which previously kept scanning even when product had been loaded, leading to API spam
      // Also removes risk of another barcode being accidentally scanned while reading details
      // this updated function pauses scanning after detecting a barcode, with Quagga.offDetected()
      // after 3 seconds, it resumes scanning (setTimeout), but only if a new barcode is detected
      Quagga.onDetected((result) => {
        const barcode = result.codeResult.code;

        if ([8, 12, 13].includes(barcode.length)) {
          console.log("Barcode detected:", barcode);
          setScannedBarcode(barcode);
          fetchProductData(barcode, setProductData, setErrorMessage, setFoundIngredients, setIsScanning); // modular function

          // Prevent duplicate scans by disabling detection temporarily
          Quagga.stop(); // stop scanner when product is detected
        } else {
          console.warn("Unsupported barcode length:", barcode.length);
        }
      });

      return () => {
        Quagga.stop();
      };
    }
  }, [isScanning]); // Scanner now only runs when isScanning is true

  // new:
  // Rescan Function (Instead of reloading page, resets scanner state, this resets only the necessary state, clearing 
  // previous scan results and restarting Quagga without reloading the whole page)
  const handleRescan = () => {
    setProductData(null);
    setScannedBarcode(null);
    setErrorMessage(null);
    setIsScanning(true);
    setManualBarcode(""); // added a section for the input of a barcode manually
    setFoundIngredients([]); // reset found ingredients

    setTimeout(() => {
      if (videoRef.current) {
        Quagga.start(); // Restart scanner
      }
    }, 500);
  };
  // : new

  // new:
  const handleManualBarcodeCheck = () => {
    if (manualBarcode.length === 8 || manualBarcode.length === 12 || manualBarcode.length === 13) {
      setScannedBarcode(manualBarcode);
      fetchProductData(manualBarcode, setProductData, setErrorMessage, setFoundIngredients, setIsScanning); // modular call
    } else {
      setErrorMessage("Please enter a valid 8, 12, or 13-digit barcode.");
    }
  };
  // : new

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* Header with login/signup links and logo */}
      <header className="w-full relative py-6">
        {/* Top-left login/signup links */}
        <div className="absolute top-4 left-4 space-x-4">
          <Link href="/login" className="text-blue-600 underline hover:text-blue-800 font-semibold">
            Log In
          </Link>
          <Link href="/signup" className="text-blue-600 underline hover:text-blue-800 font-semibold">
            Sign Up
          </Link>
        </div>

        {/* Centered logo and text */}
        <div className="text-center">
          <Image
            src={upfLogo}
            alt="UPF Unwrapped Logo"
            width={200}
            height={100}
            className="mx-auto"
          />
          <h1 className="text-4xl font-bold text-primary">UPF Unwrapped</h1>
          <p className="text-lg text-secondary">Scan. Learn. Eat Better.</p>
        </div>
      </header>

      {/* Update to show the scanner ONLY if isScanning is true; camera on while product info shows is distracting */}
      {isScanning ? (
        <div className="w-full max-w-md p-4 bg-white rounded-lg shadow-lg">
          <div ref={videoRef} id="barcode-scanner" className="w-full h-64 bg-gray-200 rounded-lg"></div>
        </div>
      ) : (
        // show product info instead of the scanner
        <ProductDetails
          productData={productData}
          foundIngredients={foundIngredients}
          errorMessage={errorMessage}
          getNovaDescription={getNovaDescription} // modular
        />
      )}

      {/* Manual Barcode Entry Option */}
      <BarcodeControls
        manualBarcode={manualBarcode}
        setManualBarcode={setManualBarcode}
        handleManualBarcodeCheck={handleManualBarcodeCheck}
        handleRescan={handleRescan}
        isScanning={isScanning}
      />
    </div>
  );
}
