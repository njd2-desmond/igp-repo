import { useEffect, useRef, useState } from "react";
import Quagga from "@ericblade/quagga2";
import Image from "next/image";
import upfLogo from "../public/upf-unwrapped-logo2.png";
import upfIngredients from '../pages/upf-ingredients';
import { searchIngredients } from '../pages/lookup.js'

export default function Home() {
  const videoRef = useRef(null);
  const [scannedBarcode, setScannedBarcode] = useState(null);
  const [productData, setProductData] = useState(null); // Store product data in state
  const [errorMessage, setErrorMessage] = useState(null);
  const [isScanning, setIsScanning] = useState(true); // New: tracks if camera should be visible; changing so that the camera switches off once scan is loaded since this is distracting
  const [manualBarcode, setManualBarcode] = useState(""); // New: State for manual barcode input
  const [foundIngredients, setFoundIngredients] = useState([]); // state to store found ingredients


  const getNovaDescription = (novaGroup) => { // changed to an object lookup, since this is faster, doesn't require if statements, and prevents errors by automatically catching unexpected values
    const descriptions = {
      1: "Unprocessed / Minimally Processed",
      2: "Processed Culinary Ingredients",
      3: "Processed Foods",
      4: "Ultra-Processed Foods (UPFs)",
    };
    return descriptions[novaGroup] || "Not available";
  };

  // new:
  const fetchProductData = async (barcode) => {
    try {
      setIsScanning(false); // Hide scanner when product is found
      const response = await fetch(`https://world.openfoodfacts.org/api/v2/product/${barcode}.json`);
      const data = await response.json();

      if (data.status === 1) {
        setProductData(data.product);
        setErrorMessage(null); // Reset any previous error messages

        if (data.product.ingredients_text) {
          const foundIngredients = searchIngredients(data.product.ingredients_text);
          console.log("Found UPF Ingredients:", foundIngredients)
          setFoundIngredients(foundIngredients);
        } else {
          console.warn("No ingredients available")
        }
      } else {
        setErrorMessage("⚠️ Product not found in database.");

        // New: Restarts the scanner automatically if the product isn't found so there is no need to press rescan
        setTimeout(() => setIsScanning(true), 1000);
      }
    } catch (error) {
      console.error("Error fetching product data:", error);
      setProductData(null);
      setErrorMessage("⚠️ Network error. Please try again.");

      // Restart scanner if network error
      setTimeout(() => Quagga.start(), 500);
    }
  };
  // :new 

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
          fetchProductData(barcode);

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
    setManualBarcode("") // added a section for the input of a barcode manually

    setTimeout(() => {
      if (videoRef.current) {
        Quagga.start(); // Restart scanner
      }
    }, 500);
  };
  // : new
  // new:
  const handleManualBarcodeCheck = () => {
    if (manualBarcode.length ===8 || manualBarcode.length === 12 || manualBarcode.length === 13) {
      setScannedBarcode(manualBarcode);
      fetchProductData(manualBarcode);
    } else {
      setErrorMessage("Please enter a valid 8, 12, or 13-digit barcode.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <header className="w-full text-center py-6">
        <Image src={upfLogo} alt="UPF Unwrapped Logo" width={200} height={100} className="mx-auto" />
        <h1 className="text-4xl font-bold text-primary">UPF Unwrapped</h1>
        <p className="text-lg text-secondary">Scan. Learn. Eat Better.</p>
      </header>

      {/* Update to show the scanner ONLY if isScanning is true; camera on while product info shows is distracting */}
      {isScanning ? (
        <div className="w-full max-w-md p-4 bg-white rounded-lg shadow-lg">
          <div ref={videoRef} id="barcode-scanner" className="w-full h-64 bg-gray-200 rounded-lg"></div>
        </div>
      ) : (
        // show product info instead of the scanner
        <div id="product-info" className="mt-4 p-4 bg-white rounded-lg shadow-lg w-full max-w-md">
          {productData ? (
            <div>
              <h3 className="text-xl font-bold">{productData.product_name || "Unknown Product Name"}</h3>
              <p><strong>{productData.brands || "Unknown Brand"}</strong> </p>
              <p><strong>Contains</strong> {productData.ingredients_text || "Not available"}</p>
              <p><strong>Nutrition Grade:</strong> {productData.nutrition_grades || "Not available"}</p>
              <p><strong>NOVA Score:</strong> {productData.nova_group} - {getNovaDescription(productData.nova_group)}</p>
              {/* Adding a section that pulls in the product image if available */}
              
              {/* Displaying Risks for Found Ingredients */}
              <div>
              {foundIngredients.length > 0 ? (
                foundIngredients.map((ingredient, index) => (
                  <div key={index}>
                    <p><strong>{ingredient.example}</strong> ({ingredient.category})</p>
                    <p>{ingredient.description}</p>
                    <p>{ingredient.risks}</p>
                  </div>
                ))
              ) : (
                <p>No at-risk ingredients found.</p>
              )}
            </div>
            {productData.image_url && <img src={productData.image_url} alt={productData.product_name} className="mt-2 w-40" />}
            </div>
            
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <p>No product scanned yet.</p>
          )}

        </div>
      )}

      {/* Manual Barcode Entry Option */}
      <div className="mt-4 w-full max-w-md p-4 bg-white rounded-lg shadow-lg">
        <p className="text-lg font-bold text-center">Enter Barcode Manually</p>
        <input
          type="text"
          value={manualBarcode}
          onChange={(e) => setManualBarcode(e.target.value)}
          placeholder="Enter barcode..."
          className="mt-2 w-full p-2 border border-gray-300 rounded-md"
        />
        <button
          onClick={handleManualBarcodeCheck}
          className="mt-2 w-full px-4 py-2 bg-green-600 text-white font-bold rounded-lg shadow hover:bg-green-700"
        >
          Check Product
        </button>
      </div>


      {/* Rescan Button  - updated to use the handleRescan function, which resets scanner without reloading page */}
      {!isScanning && (
        <button
          onClick={handleRescan}
          className="mt-4 px-4 py-2 bg-blue-600 text-white font-bold rounded-lg shadow hover:bg-blue-700"
        >
          Scan Again
        </button>
      )}
    </div>
  );
}