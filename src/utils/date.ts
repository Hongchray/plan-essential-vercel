// Basic date/time formatting functions

/**
 * Format date to readable string
 * @param {Date|string} date - Date object or date string
 * @param {string} format - Format type: 'short', 'medium', 'long', 'full'
 * @returns {string} Formatted date string
 */
export function formatDate(date: string | number | Date, format = "medium") {
  if (!date) return "";

  const d = new Date(date);
  if (isNaN(d.getTime())) return "Invalid Datettt";

  const options = {
    short: {
      year: "numeric",
      month: "short",
      day: "numeric",
    },
    medium: {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
    long: {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    },
    full: {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  };

  return d.toLocaleDateString(
    "en-US",
    options[format as keyof typeof options] as Intl.DateTimeFormatOptions
  );
}

/**
 * Format time to readable string
 * @param {Date|string} date - Date object or date string
 * @param {boolean} includeSeconds - Whether to include seconds
 * @returns {string} Formatted time string
 */
export function formatTime(
  date: string | number | Date,
  includeSeconds = false
) {
  if (!date) return "";

  const d = new Date(date);
  if (isNaN(d.getTime())) return "Invalid Time";

  const options = {
    hour: "2-digit",
    minute: "2-digit",
    ...(includeSeconds && { second: "2-digit" }),
  };

  return d.toLocaleTimeString("en-US", options as Intl.DateTimeFormatOptions);
}

/**
 * Format date and time together
 * @param {Date|string} date - Date object or date string
 * @param {string} dateFormat - Date format: 'short', 'medium', 'long'
 * @param {boolean} includeSeconds - Whether to include seconds in time
 * @returns {string} Formatted date and time string
 */
export function formatDateTime(
  date: string | number | Date,
  dateFormat = "short",
  includeSeconds = false
) {
  if (!date) return "";

  const d = new Date(date);
  if (isNaN(d.getTime())) return "Invalid DateTime";

  const dateOptions = {
    short: { month: "short", day: "numeric", year: "numeric" },
    medium: { month: "long", day: "numeric", year: "numeric" },
    long: { weekday: "short", month: "long", day: "numeric", year: "numeric" },
  };

  const timeOptions = {
    hour: "2-digit",
    minute: "2-digit",
    ...(includeSeconds && { second: "2-digit" }),
  };

  const formattedDate = d.toLocaleDateString(
    "en-US",
    dateOptions[
      dateFormat as keyof typeof dateOptions
    ] as Intl.DateTimeFormatOptions
  );
  const formattedTime = d.toLocaleTimeString(
    "en-US",
    timeOptions as Intl.DateTimeFormatOptions
  );

  return `${formattedDate} at ${formattedTime}`;
}

/**
 * Format date to relative time (e.g., "2 hours ago", "in 3 days")
 * @param {Date|string} date - Date object or date string
 * @returns {string} Relative time string
 */
export function formatRelativeTime(date: string | number | Date) {
  if (!date) return "";

  const d = new Date(date);
  if (isNaN(d.getTime())) return "Invalid Datetttt";

  const now = new Date();
  const diffInMs = d.getTime() - now.getTime();
  const diffInMinutes = Math.floor(Math.abs(diffInMs) / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  const isPast = diffInMs < 0;
  const prefix = isPast ? "" : "in ";
  const suffix = isPast ? " ago" : "";

  if (diffInMinutes < 1) {
    return "just now";
  } else if (diffInMinutes < 60) {
    return `${prefix}${diffInMinutes} minute${
      diffInMinutes !== 1 ? "s" : ""
    }${suffix}`;
  } else if (diffInHours < 24) {
    return `${prefix}${diffInHours} hour${
      diffInHours !== 1 ? "s" : ""
    }${suffix}`;
  } else if (diffInDays < 7) {
    return `${prefix}${diffInDays} day${diffInDays !== 1 ? "s" : ""}${suffix}`;
  } else {
    return formatDate(date, "short");
  }
}

/**
 * Format date to custom pattern
 * @param {Date|string} date - Date object or date string
 * @param {string} pattern - Custom pattern (e.g., "YYYY-MM-DD", "DD/MM/YYYY")
 * @returns {string} Formatted date string
 */
export function formatDateCustom(
  date: string | number | Date,
  pattern = "YYYY-MM-DD"
) {
  if (!date) return "";

  const d = new Date(date);
  if (isNaN(d.getTime())) return "Invalid Datetttt";

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  const hour24 = d.getHours();
  const hour12 = hour24 % 12 || 12;
  const hour = String(hour24).padStart(2, "0");
  const hour12Str = String(hour12).padStart(2, "0");

  const minute = String(d.getMinutes()).padStart(2, "0");
  const second = String(d.getSeconds()).padStart(2, "0");
  const ampm = hour24 >= 12 ? "PM" : "AM";

  return pattern
    .replace("YYYY", year.toString())
    .replace("MM", month)
    .replace("DD", day)
    .replace("HH", hour) // 24-hour format
    .replace("hh", hour12Str) // 12-hour format
    .replace("mm", minute)
    .replace("ss", second)
    .replace("A", ampm);
}
/**
 * Check if date is today
 * @param {Date|string} date - Date object or date string
 * @returns {boolean} True if date is today
 */
export function isToday(date: string | number | Date) {
  if (!date) return false;

  const d = new Date(date);
  const today = new Date();

  return d.toDateString() === today.toDateString();
}

/**
 * Check if date is within current week
 * @param {Date|string} date - Date object or date string
 * @returns {boolean} True if date is within current week
 */
export function isThisWeek(date: string | number | Date) {
  if (!date) return false;

  const d = new Date(date);
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  weekStart.setHours(0, 0, 0, 0);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  return d >= weekStart && d <= weekEnd;
}
