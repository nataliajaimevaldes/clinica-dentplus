export const calculateDiscount = (membershipType, amount) => {
    let discount = 0;
    switch (membershipType) {
        case "silver":
            discount = 0.05;
            break;
        case "gold":
            discount = 0.10;
            break;
        case "platinum":
            discount = 0.20;
            break;
    }
    const finalPrice = amount - amount * discount;
    return {
        discountPercentage: discount * 100,
        finalPrice
    };
};
