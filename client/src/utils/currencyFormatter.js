/**
 * Format a number as USD currency
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string (e.g., "$1,234.56")
 */
export function formatCurrency(amount) {
  // Format number with commas for thousands and 2 decimal places
  const formattedAmount = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  
  // Return USD format with dollar sign
  return `$${formattedAmount}`;
}

