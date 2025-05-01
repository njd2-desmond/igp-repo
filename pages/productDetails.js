// show product info instead of the scanner
export default function ProductDetails({productData, foundIngredients, errorMessage, getNovaDescription }) {
    if (productData) {
        return (
            <div id="product-info" className="mt-4 p-4 bg-white rounded-lg shadow-lg w-full max-w-md">
                <h3 className="text-xl font-bold">{productData.product_name || "Unknown Product Name"}</h3>
                <p><strong>{productData.brands || "Unknown Brand"}</strong> </p>
                <p><strong>Contains</strong> {productData.ingredients_text || "Not available"}</p>
                <p><strong>Nutrition Grade:</strong> {productData.nutrition_grades || "Not available"}</p>
                <p><strong>NOVA Score:</strong> {productData.nova_group} - {getNovaDescription(productData.nova_group)}</p>
                
                
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
  {/* Adding a section that pulls in the product image if available */}
  {productData.image_url && <img src={productData.image_url} alt={productData.product_name} className="mt-2 w-40" />}
  </div>
        );
    }
    if (errorMessage) {
        return <p className="text-red-500">{errorMessage}</p>
    }

    return <p>No product scanned yet.</p>
}