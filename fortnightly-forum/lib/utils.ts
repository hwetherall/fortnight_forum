/**
 * Calculate the current fortnight ID based on April 7, 2025 as reference
 * @returns The date of the Monday starting the current fortnight in YYYY-MM-DD format
 */
export function calculateCurrentFortnightId(): string {
  // Reference date: April 7, 2025 (a Monday)
  const referenceDate = new Date(2025, 3, 7); // Note: Month is 0-indexed in JS
  const now = new Date();
  
  // Calculate the difference in days
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  const daysSinceReference = Math.floor((now.getTime() - referenceDate.getTime()) / millisecondsPerDay);
  
  // Calculate how many complete fortnights have passed
  const fortnight = Math.floor(daysSinceReference / 14);
  
  // Calculate the date of the current fortnight start (always a Monday)
  const currentFortnightStart = new Date(referenceDate);
  currentFortnightStart.setDate(referenceDate.getDate() + (fortnight * 14));
  
  // Format date as YYYY-MM-DD
  return currentFortnightStart.toISOString().split('T')[0];
}

/**
 * Format date for display
 * @param dateString ISO date string
 * @returns Formatted date string (e.g., "April 7, 2025")
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Formats a date as YYYY-MM-DD for database storage
 */
export function formatDateForDatabase(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Formats a date into a human-readable format (e.g., "Apr 7 - Apr 21, 2025")
 */
export function formatFortnightDateRange(startDate: Date): string {
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 13); // Fortnight is 14 days, so end date is start + 13
  
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  const startFormatted = startDate.toLocaleDateString('en-US', options);
  const endFormatted = endDate.toLocaleDateString('en-US', options);
  const year = endDate.getFullYear();
  
  return `${startFormatted} - ${endFormatted}, ${year}`;
}