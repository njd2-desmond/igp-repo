import { searchIngredients } from './riskLookup.js'

export const fetchProductData = async (barcode, setProductData, setErrorMessage, setFoundIngredients, setIsScanning) => {
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
        setErrorMessage("Product not found in database.");

        // New: Restarts the scanner automatically if the product isn't found so there is no need to press rescan
        setTimeout(() => setIsScanning(true), 1000);
      }
    } catch (error) {
      console.error("Error fetching product data:", error);
      setProductData(null);
      setErrorMessage("Network error. Please try again.");

      // Restart scanner if network error
      setTimeout(() => Quagga.start(), 500);
    }
  };
  // :new 
