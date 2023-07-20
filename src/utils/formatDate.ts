export const formatDate = (date: string): string => {
  const utcDate = new Date(date);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZone: 'Asia/Kolkata',
  };
  return utcDate.toLocaleDateString('en-IN', options);
};
