import { useEffect, useRef, useState } from "react";
import Quagga from "@ericblade/quagga2";
// import { fetchProductData } from "./api.js";

const useBarcodeScanner = () => {
    const videoRef = useRef(null);
    const [scannedBarcode, setScannedBarcode] = useState(null);
    const [isScanning, setIsScanning] = useState(false); // New: tracks if camera should be visible; changing so that the camera switches off once scan is loaded since this is distracting

    useEffect(() => {
        if (typeof window !== "undefined" && videoRef.current) {
          Quagga.init(
            {
              inputStream: { name: "Live", type: "LiveStream", target: videoRef.current },
              decoder: { readers: ["ean_reader", "ean_8_reader", "upc_reader", "upc_e_reader"] },
            },
            function (err) {
              if (err) {
                console.error("Quagga init error:", err);
                return;
              }
              Quagga.start();
            }
          );
    
          // improved quagga onDetected function which previously kept scanning even when product had been loaded, leading to API spam
          // Also removes risk of another barcode being accidentally scanned while reading details
          // this updated function pauses scanning after detecting a barcode, with Quagga.offDetected()
          // after 3 seconds, it resumes scanning (setTimeout), but only if a new barcode is detected
          Quagga.onDetected((result) => {
            const barcode = result.codeResult.code;
            setScannedBarcode(barcode);
            setIsScanning(false);
            Quagga.stop();
            //if ([8, 12, 13].includes(barcode.length)) {
              //console.log("Barcode detected:", barcode);
              //setScannedBarcode(barcode);
              //fetchProductData(barcode);
              // Prevent duplicate scans by disabling detection temporarily
              //Quagga.stop(); // stop scanner when product is detected
            //} //else {
              //console.warn("⚠️ Unsupported barcode length:", barcode.length);
            //}
          });
    
          return () => {
            Quagga.stop();
          };
        }
      }, []); // Scanner now only runs when isScanning is true
    
      return { videoRef, scannedBarcode, isScanning, setIsScanning, setScannedBarcode };    
};

export default useBarcodeScanner;