export default function formatNumberWithQuote(num: number): string {
    // Format the number to two decimal places
    const formattedNumber = num.toFixed(2);

    // Split the number into the integer and decimal parts
    const [integerPart, decimalPart] = formattedNumber.split(".");

    // Add the thousands separator using regex
    const integerWithSeparator = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, "'");

    // Combine the integer and decimal parts
    return `${integerWithSeparator}.${decimalPart}`;
}


