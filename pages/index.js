import { useEffect, useRef, useState } from "react";
import Quagga from "@ericblade/quagga2";
import Image from "next/image";
import upfLogo from "../public/upf-unwrapped-logo2.png";

export default function Home() {

  const videoRef = useRef(null);
  const [productData, setProductData] = useState(null); // ✅ Store product data in state
  const getNovaDescription = (novaGroup) => {
    if (novaGroup === 1) return "Unprocessed / Minimally Processed";
    if (novaGroup === 2) return "Processed Culinary Ingredients";
    if (novaGroup === 3) return "Processed Foods";
    if (novaGroup === 4) return "Ultra-Processed Foods (UPFs)";
    return "Not available";
  };


  useEffect(() => {
    if (typeof window !== "undefined" && videoRef.current) {
      Quagga.init({
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: videoRef.current,
        },
        decoder: {
          readers: ["ean_reader"], 
        },
      }, function (err) {
        if (err) {
          console.error("Quagga init error:", err);
          return;
        }
        console.log("Quagga initialized successfully.");
        Quagga.start();
      });

      Quagga.onDetected((result) => {
        if (result.codeResult.code.length === 13) {
          console.log("Barcode detected:", result.codeResult.code);
          fetch(`https://world.openfoodfacts.org/api/v2/product/${result.codeResult.code}.json`)

            .then(response => response.json())
            .then(data => {
              console.log("Product data:", data);
              if (data && data.product) {
                setProductData(data.product); // ✅ Store product data in state
                console.log("State updated with:", data.product);
              } else {
                console.error("No product found in API response:", data);
              }
            })
            .catch(error => console.error("Error fetching product data:", error));
      
          // ✅ Delay stopping Quagga to ensure state updates
          setTimeout(() => Quagga.stop(), 1000);
        }
      });
      

      return () => {
        Quagga.stop();
      };
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
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

      <div className="w-full max-w-md p-4 bg-white rounded-lg shadow-lg">
        <div ref={videoRef} id="barcode-scanner" className="w-full h-64 bg-gray-200 rounded-lg"></div>
      </div>

      {/* ✅ Use state to display product info */}
      <div id="product-info" className="mt-4 p-4 bg-white rounded-lg shadow-lg w-full max-w-md">
        {productData ? (
          <div>
            <h3>Product Name: {productData.product_name || "Unknown"}</h3>
            <p><strong>Brand:</strong> {productData.brands || "Unknown"}</p>
            <p><strong>Ingredients:</strong> {productData.ingredients_text || "Not available"}</p>
            <p><strong>Nutrition Grade:</strong> {productData.nutrition_grades || "Not available"}</p>
            <p><strong>NOVA Score:</strong> {productData.nova_group} - {getNovaDescription(productData.nova_group)}</p>  {/* ✅ Add NOVA score */}
          
          {/* Refresh Button */}
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white font-bold rounded-lg shadow hover:bg-blue-700">
            Scan Again
          </button>
        </div>
        ) : (
          <p>No product scanned yet</p>
        )}
      </div>
    </div>
  );
}
