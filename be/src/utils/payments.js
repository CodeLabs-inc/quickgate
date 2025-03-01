const isValidExpirationDate = (expirationDate) => {
    const regex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
    if (!regex.test(expirationDate)) {
        return { isValid: false, message: "Invalid card expiration date format (MM/YY)" };
    }

    const [expMonth, expYear] = expirationDate.split("/").map(Number);
    const currentYear = new Date().getFullYear(); //remove the 20 from the year
    const shortCurrentYear = currentYear % 100; // Get the last two digits of the year
    const currentMonth = new Date().getMonth() + 1; // +1 because getMonth() is zero-based

    
    console.log(expMonth, expYear)
    console.log(currentMonth, shortCurrentYear)
    // Check if the card is expired
    if (expYear < shortCurrentYear || (expYear === shortCurrentYear && expMonth < currentMonth)) {
        return { isValid: false, message: "Card is expired" };
    }

    return { isValid: true };
};


module.exports = {
    isValidExpirationDate
}