export const FAQ_ITEMS = [
  {
    question: 'Where is Roma Mart located in Sarnia?',
    answer:
      'Roma Mart is at 3-189 Wellington Street, Sarnia, ON N7T 1G6. Free parking, wheelchair accessible, open 7 days a week.',
  },
  {
    question: 'Does Roma Mart sell halal meat?',
    answer:
      'Yes. Roma Mart has an in-store halal meat counter with fresh goat, chicken, mutton and cuts for curry, biryani and kabab.',
  },
  {
    question: 'Is there a Bitcoin ATM at Roma Mart?',
    answer:
      'Yes. Roma Mart hosts a Bitcoin ATM alongside a standard ATM, and also accepts Bitcoin as payment at the register.',
  },
  {
    question: "What are Roma Mart's hours?",
    answer: 'Roma Mart is open 7 days a week. See the Locations page for current hours, synced live with Google.',
  },
  {
    question: 'What is RoCafé?',
    answer:
      'RoCafé is the in-store coffee bar at Roma Mart serving espresso, matcha lattes, smoothies and pastries — all made to order on Wellington Street in Sarnia.',
  },
  {
    question: 'Does Roma Mart accept cash, debit and credit?',
    answer:
      'Yes. Roma Mart accepts cash, Interac, Visa, Mastercard, American Express and Bitcoin. Lottery, ATM withdrawals and printing are also available.',
  },
];

export const buildFAQSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.map(({ question, answer }) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: answer,
    },
  })),
});
