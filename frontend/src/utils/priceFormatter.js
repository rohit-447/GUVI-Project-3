/**
 * Format price to currency format
 * @param {number} price - Price amount
 * @param {string} currency - Currency code (default: USD)
 * @returns {string} Formatted price string
 */
export const formatPrice = (price, currency = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
  }).format(price);
};

/**
 * Format price without currency symbol
 * @param {number} price - Price amount
 * @returns {string} Formatted price string without currency symbol
 */
export const formatPriceWithoutSymbol = (price) => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};


export default formatPrice