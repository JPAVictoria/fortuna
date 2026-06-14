export const FORTUNA_QUOTES = [
  { text: 'Fortuna favet fortibus.', translation: 'Fortune favors the bold.' },
  { text: 'Pecunia non olet.', translation: 'Money has no smell — every peso counts.' },
  { text: 'Bis dat qui cito dat.', translation: 'He gives twice who gives quickly. Save before you spend.' },
  { text: 'Omnia aliena sunt, tempus tantum nostrum est.', translation: 'All things are alien to us; time alone is ours. Spend it wisely.' },
  { text: 'Dimidium facti qui coepit habet.', translation: 'He who has begun is half done. Start your savings goal today.' },
  { text: 'Dum differtur vita transcurrit.', translation: 'While we delay, life passes. Do not delay your financial goals.' },
  { text: 'Per aspera ad astra.', translation: 'Through hardship to the stars. Every sacrifice builds wealth.' },
  { text: 'Gutta cavat lapidem.', translation: 'A drop hollows the stone. Small savings compound into fortunes.' },
  { text: 'Nusquam est qui ubique est.', translation: 'He who is everywhere is nowhere. Focus your spending.' },
  { text: 'Fac et spera.', translation: 'Do and hope. Take action on your finances today.' },
  { text: 'Qui audet adipiscitur.', translation: 'Who dares, wins. Dare to save aggressively.' },
  { text: 'In medio stat virtus.', translation: 'Virtue stands in the middle. Balance spending and saving.' },
];

export function getDailyQuote(): typeof FORTUNA_QUOTES[0] {
  const day = new Date().getDate();
  return FORTUNA_QUOTES[day % FORTUNA_QUOTES.length];
}
