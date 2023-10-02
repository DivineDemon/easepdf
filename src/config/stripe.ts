export const plans = [
  {
    name: "Free",
    slug: "free",
    quota: 10,
    pagesPerPDF: 5,
    price: {
      amount: 0,
      priceIDs: {
        test: "",
        production: "",
      },
    },
  },
  {
    name: "Pro",
    slug: "pro",
    quota: 50,
    pagesPerPDF: 25,
    price: {
      amount: 14,
      priceIDs: {
        test: process.env.STRIPE_PRICE_ID,
        production: "",
      },
    },
  },
];
