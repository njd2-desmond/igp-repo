import React from "react";

const BarcodeControls =({
    manualBarcode,
    setManualBarcode,
    handleManualBarcodeCheck,
    handleRescan,
    isScanning,
}) => {
    return (
        <>
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
        </>
    );
};

export default BarcodeControls;
