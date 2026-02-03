// Obtener tipo de cambio USD/ARS (dólar blue) - solo para referencia
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
