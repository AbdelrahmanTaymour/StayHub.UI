const CURRENCY_SYMBOLS: Record<string, { en: string; ar: string }> = {
  USD: { en: "$", ar: "$" },
  EUR: { en: "€", ar: "€" },
  EGP: { en: "E£", ar: "ج.م" },
}

export function formatPrice(amount: number, currency: string, locale: string) {
  const language = locale.startsWith("ar") ? "ar" : "en"
  const symbol = CURRENCY_SYMBOLS[currency]?.[language]

  if (!symbol) {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const number = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
  }).format(amount)

  // Arabic puts the symbol after the number, English puts it before.
  return language === "ar" ? `${number} ${symbol}` : `${symbol} ${number}`
}
