//All UI Elements here

const getNovaDescription = (novaGroup) => ({ // changed to an object lookup, since this is faster, doesn't require if statements, and prevents errors by automatically catching unexpected values
    1: "Unprocessed / Minimally Processed",
    2: "Processed Culinary Ingredients",
    3: "Processed Foods",
    4: "Ultra-Processed Foods (UPFs)",
    })[novaGroup] || "Not available";

const ProductInfo = ({ productData, errorMessage }) => {
    if (errorMessage) return <p className="text-red-500"></p>;
    if (!productData) return <p>No product scanned yet. </p>;

    return (
        <div className="mt-4 p-4 bg-white rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-bond">{productData.product_name} || "Unknown</h3>
            <p><strong>Brand:</strong> {productData.brands || "Unknown"}</p>
            <p><strong>Ingredients:</strong> {productData.ingredients_text || "Not available"}</p>
            <p><strong>Nutrition Grade:</strong> {productData.nutrition_grades || "Not available"}</p>
            <p><strong>NOVA Score:</strong> {productData.nova_group} - {getNovaDescription(productData.nova_group)}</p>
            {productData.image_url && <img src={productData.image_url} alt={productData.product_name} className="mt-2 w-40" />}
        </div>
    );
};

export default ProductInfo;