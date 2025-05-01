import upfIngredients from './riskDictionary.js'; // loads dictionary from different file

export function searchIngredients(inputStr) {
    const input = inputStr.toLowerCase();
    const found = [];

    upfIngredients.forEach(item => {
        item.examples.forEach(example => {
            if (input.includes(example.toLowerCase())) { // does input string contain an ingredient?
                found.push({
                    example: example,
                    category: item.category,
                    description: item.description,
                    risks: item.risks
                }); // add to found set
                console.log("Found ingredients:", example)
            }
        });
    });
    return found; // return found ingredients
};