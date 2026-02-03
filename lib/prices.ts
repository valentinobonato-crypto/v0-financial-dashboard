// Obtener precio de acción desde Yahoo Finance
export async function getStockPriceUSD(symbol: string): Promise<number | null> {
  try {
    const response = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`,
      { next: { revalidate: 300 } } // Cache por 5 minutos
    );
    
    if (!response.ok) return null;
    
    const data = await response.json();
    const price = data?.chart?.result?.[0]?.meta?.regularMarketPrice;
    
    return price || null;
  } catch (error) {
    console.error(`Error obteniendo precio de ${symbol}:`, error);
    return null;
  }
}

// Obtener tipo de cambio USD/ARS (dólar blue o MEP)
export async function getDolarBlue(): Promise<number | null> {
  try {
    const response = await fetch('https://dolarapi.com/v1/dolares/blue');
    
    if (!response.ok) return null;
    
    const data = await response.json();
    return data?.venta || null;
  } catch (error) {
    console.error('Error obteniendo dólar blue:', error);
    return null;
  }
}

// Obtener precio en ARS
export async function getStockPriceARS(symbol: string): Promise<{
  priceUSD: number | null;
  priceARS: number | null;
  dolarBlue: number | null;
}> {
  const [priceUSD, dolarBlue] = await Promise.all([
    getStockPriceUSD(symbol),
    getDolarBlue()
  ]);
  
  const priceARS = priceUSD && dolarBlue ? priceUSD * dolarBlue : null;
  
  return {
    priceUSD,
    priceARS,
    dolarBlue
  };
}

// Actualizar múltiples activos
export async function updateAllPrices(symbols: string[]): Promise<Map<string, number | null>> {
  const dolarBlue = await getDolarBlue();
  const results = new Map<string, number | null>();
  
  for (const symbol of symbols) {
    const priceUSD = await getStockPriceUSD(symbol);
    const priceARS = priceUSD && dolarBlue ? priceUSD * dolarBlue : null;
    results.set(symbol, priceARS);
  }
  
  return results;
}
