export const getNovaDescription = (novaGroup) => { // changed to an object lookup, since this is faster, doesn't require if statements, and prevents errors by automatically catching unexpected values
    const descriptions = {
      1: "Unprocessed / Minimally Processed",
      2: "Processed Culinary Ingredients",
      3: "Processed Foods",
      4: "Ultra-Processed Foods (UPFs)",
    };
    return descriptions[novaGroup] || "Not available";
  };
