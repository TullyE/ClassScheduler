export function parseDays(inputString) {
    const daysMapping = {
        "M": "Monday",
        "Tu": "Tuesday",
        "W": "Wednesday",
        "Th": "Thursday",
        "F": "Friday",
        "Sa": "Saturday",
        "Su": "Sunday"
    };
    const parsedDays = [];
    let i = 0;

    while (i < inputString.length) {
        if (i + 2 <= inputString.length && inputString.substring(i, i + 2) in daysMapping) {
            if (parsedDays.includes(daysMapping[inputString.substring(i, i + 2)])) {
                return [false, "Two of the same day"];  // Two of the same day
            }
            parsedDays.push(daysMapping[inputString.substring(i, i + 2)]);
            i += 2;
        } else if (inputString[i] in daysMapping) {
            if (parsedDays.includes(daysMapping[inputString[i]])) {
                return [false, "Two of the same day"];  // Two of the same day
            }
            parsedDays.push(daysMapping[inputString[i]]);
            i += 1;
        } else {
            return [false, "Key Error"];  // Key error
        }
    }

    // Check if days are in the correct order
    const daysOrder = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
    ];

    for (let j = 1; j < parsedDays.length; j++) {
        if (daysOrder.indexOf(parsedDays[j]) < daysOrder.indexOf(parsedDays[j - 1])) {
            return [false, "Wrong Order"];  // Wrong order
        }
    }

    return parsedDays;
}
