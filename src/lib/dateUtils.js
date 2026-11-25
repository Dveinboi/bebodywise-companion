const pad = (n) => String(n).padStart(2, '0');

/** Format a Date as `YYYY-MM-DDTHH:mm` (the value format of <input type="datetime-local">). */
export function toLocalDateTimeInput(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/** `datetime-local` string for `hoursAgo` hours before `now`. */
export function hoursAgoInput(hoursAgo, now = Date.now()) {
  return toLocalDateTimeInput(new Date(now - hoursAgo * 3600 * 1000));
}

export function formatShortDayTime(date) {
  return `${date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}
