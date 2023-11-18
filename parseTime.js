export function isValidTimeFormat(timeString) {
    // Regular expression for the specified time format
    const timeRegex = /^(1[0-2]|0?[1-9]):([0-5][0-9]) (AM|PM)$/;

    // Check if the input string matches the specified format
    return timeRegex.test(timeString);
}

export function secondTimeAfterFirst(t1, t2) {
    // Convert time strings to Date objects
    const militaryT1 = convert12HourTo24Hour(t1)
    const militaryT2 = convert12HourTo24Hour(t2)

    const dateT1 = new Date('2000-01-01T' + militaryT1);
    const dateT2 = new Date('2000-01-01T' + militaryT2);
    // Check if the conversion was successful
    if (isNaN(dateT1.getTime()) || isNaN(dateT2.getTime())) {
        console.error('Invalid time format');
        return false;
    }

    // Compare the times
    return dateT1 < dateT2;
}

function convert12HourTo24Hour(time12h) {
    // Extract hours, minutes, and AM/PM from the input string
    const [, hours, minutes, period] = time12h.match(/^(\d{1,2}):(\d{2}) ([APMapm]{2})$/);

    // Convert hours to 24-hour format
    let hours24 = parseInt(hours, 10);
    if (period.toUpperCase() === 'PM' && hours24 < 12) {
        hours24 += 12;
    } else if (period.toUpperCase() === 'AM' && hours24 === 12) {
        hours24 = 0;
    }

    // Format the result
    const hoursString = hours24.toString().padStart(2, '0');
    const minutesString = minutes.padStart(2, '0');

    return `${hoursString}:${minutesString}:00`;
}
