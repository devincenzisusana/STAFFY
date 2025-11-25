export const getCurrentTime = () => {
  return new Date().toTimeString().slice(0, 5);
};

export const calculateTotalHours = (
  clockIn: string,
  clockOut: string,
  breakDuration: string
): { totalHours: string; overtime: string } => {
  // Parse times
  const [inHour, inMinute] = clockIn.split(":").map(Number);
  const [outHour, outMinute] = clockOut.split(":").map(Number);

  // Calculate total minutes worked
  const inMinutes = inHour * 60 + inMinute;
  const outMinutes = outHour * 60 + outMinute;
  let workedMinutes = outMinutes - inMinutes;

  // Handle cases where clock out is after midnight
  if (workedMinutes < 0) {
    workedMinutes += 24 * 60;
  }

  // Subtract break duration
  if (breakDuration) {
    const [breakHour, breakMinute] = breakDuration.split(":").map(Number);
    const breakMinutes = breakHour * 60 + breakMinute;
    workedMinutes -= breakMinutes;
  }

  // Convert to hours
  const totalHours = workedMinutes / 60;

  // Calculate overtime (anything over 8 hours)
  const standardHours = 8;
  const overtime = Math.max(0, totalHours - standardHours);

  return {
    totalHours: totalHours.toFixed(2),
    overtime: overtime.toFixed(2),
  };
};
