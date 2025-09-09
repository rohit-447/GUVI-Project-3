/**
 * Format date to a readable format
 * @param {string|Date} dateString - Date string or Date object
 * @param {Object} options - Formatting options
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString, options = {}) => {
  const date = new Date(dateString);

  // Default options
  const defaultOptions = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  };

  // Merge with user options
  const formatOptions = { ...defaultOptions, ...options };

  return date.toLocaleDateString("en-US", formatOptions);
};

/**
 * Format date range (start date to end date)
 * @param {string|Date} startDate - Start date
 * @param {string|Date} endDate - End date
 * @returns {string} Formatted date range
 */
export const formatDateRange = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Same day event
  if (start.toDateString() === end.toDateString()) {
    return `${formatDate(start, {
      hour: "2-digit",
      minute: "2-digit",
    })} - ${end.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }

  // Multiple day event
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
};

export default formatDate 