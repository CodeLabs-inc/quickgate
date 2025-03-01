export function formatThousandsSeparators(num: number): string {
    // Split the number into integer and decimal parts
    const [integerPart, decimalPart] = num.toString().split('.');

    // Format the integer part with commas
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, "'");

    // If there's a decimal part, return the formatted number
    if (decimalPart) {
        return `${formattedInteger}.${decimalPart}`;
    }

    return formattedInteger;
}

