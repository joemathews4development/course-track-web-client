/**
 * Convert ISO datetime string to format compatible with HTML datetime-local input.
 * Pads month, day, hours, and minutes with leading zeros for proper formatting.
 *
 * @param {string} isoDate - ISO format datetime string (e.g., "2026-02-21T14:30:00.000Z")
 * @returns {string} Formatted datetime string for input fields (e.g., "2026-02-21T14:30")
 *
 * @example
 * const isoDate = "2026-02-21T14:30:00.000Z"
 * getFormattedInputDate(isoDate) // Returns "2026-02-21T14:30"
 */
export const getFormattedInputDate = (isoDate: string) => {
    if (!isoDate) return ""
    const dateObj = new Date(isoDate)
    const pad = (num: number) => num.toString().padStart(2, "0")
    return `${dateObj.getFullYear()}-${pad(dateObj.getMonth() + 1)}-${pad(dateObj.getDate())}`
}

/**
 * Convert ISO datetime string to human-readable format for display in the UI.
 * Uses en-US locale with full date and time components.
 *
 * @param {string} isoDate - ISO format datetime string (e.g., "2026-02-21T14:30:00.000Z")
 * @returns {string} Formatted readable datetime (e.g., "February 21, 2026, 02:30 PM")
 *
 * @example
 * const isoDate = "2026-02-21T14:30:00.000Z"
 * displayableDateTime(isoDate) // Returns "February 21, 2026, 02:30 PM"
 */
export const displayableDateTime = (isoDate: string) => { 
    return new Date(isoDate).toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
    })
}