export const formatTicker = (ticker: string): string => {
    if (!ticker) return '';

    // Normalize input
    const t = ticker.toUpperCase();

    // Specific mappings
    if (t === 'MNQ' || t === 'NQ') return 'NQ/MNQ';
    if (t === 'MES' || t === 'ES') return 'ES/MES';
    if (t === 'MGC' || t === 'GC') return 'GC/MGC';
    if (t === 'MCL' || t === 'CL') return 'CL/MCL';
    if (t === 'RTY' || t === 'M2K') return 'RTY/M2K';

    return t;
};

export const formatPrice = (price: string | number): string => {
    if (!price) return '';
    return Number(price).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};
