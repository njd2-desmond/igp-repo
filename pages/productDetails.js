// show product info instead of the scanner
export default function ProductDetails({
    productData,
    foundIngredients,
    errorMessage,
    getNovaDescription,
  }) {
    if (productData) {
      return (
        <div
          id="product-info"
          className="mt-4 p-4 bg-white rounded-lg shadow-lg w-full max-w-4xl flex flex-col md:flex-row gap-6"
        >
          {/* Product Image Section */}
          {productData.image_url && (
            <div className="flex-shrink-0">
              <img
                src={productData.image_url}
                alt={productData.product_name}
                className="w-40 h-auto rounded-lg"
              />
            </div>
          )}
  
          {/* Product Text Details Section */}
          <div className="flex-grow">
            <h3 className="text-xl font-bold">
              {productData.product_name || "Unknown Product Name"}
            </h3>
            <p>
              <strong>{productData.brands || "Unknown Brand"}</strong>
            </p>
            <p>
              <strong>Contains</strong>{" "}
              {productData.ingredients_text ? (
                (() => {
                  let highlighted = productData.ingredients_text;
  
                  foundIngredients.forEach((ing) => {
                    const regex = new RegExp(`\\b(${ing.example})\\b`, "gi");
                    highlighted = highlighted.replace(
                      regex,
                      `<span class="text-warning font-semibold">$1</span>`
                    );
                  });
  
                  return (
                    <span
                      dangerouslySetInnerHTML={{ __html: highlighted }}
                    />
                  );
                })()
              ) : (
                "Not available"
              )}
            </p>
            <p>
              <strong>Nutrition Grade:</strong>{" "}
              {productData.nutrition_grades || "Not available"}
            </p>
            <p>
              <strong>NOVA Score:</strong> {productData.nova_group} -{" "}
              {getNovaDescription(productData.nova_group)}
            </p>
  
            {/* Displaying Risks for Found Ingredients */}
            {foundIngredients.length > 0 ? (
              <div className="mt-4">
                <h4 className="text-lg font-bold">At-Risk Ingredients</h4>
                {foundIngredients.map((ingredient, index) => (
                  <div
                    key={index}
                    className="mt-3 p-3 border border-gray-300 rounded-md bg-gray-50"
                  >
                    <p className="font-semibold text-gray-800">
                      {ingredient.example}{" "}
                      <span className="text-sm font-normal text-gray-600">
                        ({ingredient.category})
                      </span>
                    </p>
  
                    <p className="mt-1 text-gray-700">{ingredient.risks}</p>
  
                    {/* If single string source */}
                    {ingredient.source && (
                      <div className="mt-2 text-sm text-gray-600">
                        <span className="italic block">Source: {ingredient.source}</span>
                        {ingredient.url && (
                          <a
                            href={ingredient.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline inline-block mt-1"
                          >
                            [Link]
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p>No at-risk ingredients found.</p>
            )}
          </div>
        </div>
      );
    }
  
    if (errorMessage) {
      return (
        <span className="text-[#F44336] font-semibold">{errorMessage}</span>
      );
    }
  
    return <p>No product scanned yet.</p>;
  }
  