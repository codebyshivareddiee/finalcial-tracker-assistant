/**
 * Formats a date string to a readable format
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Returns the start and end date for a given date range
 */
export function getDateRangeTimestamps(dateRange: string): { start: Date; end: Date } {
  const now = new Date();
  let end = new Date();
  let start = new Date();

  switch (dateRange) {
    case 'thisMonth':
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end.setHours(23, 59, 59, 999);
      break;
    case 'lastMonth':
      start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      end = new Date(now.getFullYear(), now.getMonth(), 0);
      end.setHours(23, 59, 59, 999);
      break;
    case 'last3Months':
      start = new Date(now.getFullYear(), now.getMonth() - 3, 1);
      end.setHours(23, 59, 59, 999);
      break;
    case 'thisYear':
      start = new Date(now.getFullYear(), 0, 1);
      end.setHours(23, 59, 59, 999);
      break;
    default:
      // Default to this month
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end.setHours(23, 59, 59, 999);
      break;
  }

  return { start, end };
}

/**
 * Get minimum and maximum amounts for a given amount range
 */
export function getAmountRange(amountRange: string): { min: number | null; max: number | null } {
  switch (amountRange) {
    case 'under500':
      return { min: 0, max: 500 };
    case '500to1000':
      return { min: 500, max: 1000 };
    case '1000to5000':
      return { min: 1000, max: 5000 };
    case 'over5000':
      return { min: 5000, max: null };
    default:
      return { min: null, max: null };
  }
}
