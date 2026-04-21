export const buildFAQSchema = (cd) => {
  const addr = cd.address;
  const dba = cd.dba;
  const items = [
    {
      question: `Where is ${dba} located in ${addr.city}?`,
      answer: `${dba} is at ${addr.street}, ${addr.city}, ${addr.province} ${addr.postalCode}. Free parking, wheelchair accessible, open 7 days a week.`,
    },
    {
      question: `Does ${dba} sell halal meat?`,
      answer: `Yes. ${dba} has an in-store halal meat counter with fresh goat, chicken, mutton and cuts for curry, biryani and kabab.`,
    },
    {
      question: `Is there a Bitcoin ATM at ${dba}?`,
      answer: `Yes. ${dba} hosts a Bitcoin ATM alongside a standard ATM, and also accepts Bitcoin as payment at the register.`,
    },
    {
      question: `What are ${dba}'s hours?`,
      answer: `${dba} is open 7 days a week. See the Locations page for current hours, synced live with Google.`,
    },
    {
      question: 'What is RoCafé?',
      answer: `RoCafé is the in-store coffee bar at ${dba} serving espresso, matcha lattes, smoothies and pastries — all made to order on Wellington Street in ${addr.city}.`,
    },
    {
      question: `Does ${dba} accept cash, debit and credit?`,
      answer: `Yes. ${dba} accepts cash, Interac, Visa, Mastercard, American Express and Bitcoin. Lottery, ATM withdrawals and printing are also available.`,
    },
  ];
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answer,
      },
    })),
  };
};
