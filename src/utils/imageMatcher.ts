import { availableProductImages } from '@/data/availableImages';

const normalize = (str: string) => {
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // remove accents
        .replace(/[^a-z0-9 ]/g, '') // remove special chars
        .trim();
};

export const findImageForProduct = (productName: string): string | undefined => {
    const normalizedProduct = normalize(productName);

    // 1. Precise Match: Filename contains product name OR product name contains filename (minus extension)
    const bestMatch = availableProductImages.find((filename) => {
        const normalizedFile = normalize(filename.replace(/\.jpg$/i, ''));

        // Check strict inclusion
        if (normalizedFile.includes(normalizedProduct) || normalizedProduct.includes(normalizedFile)) {
            return true;
        }

        // Check if significant words match (token based)
        const productTokens = normalizedProduct.split(' ').filter(t => t.length > 2);
        const fileTokens = normalizedFile.split(' ').filter(t => t.length > 2);

        // If name is short, require exact inclusion. If long, require high overlap.
        const matchingTokens = productTokens.filter(token => fileTokens.includes(token));
        const matchRatio = matchingTokens.length / productTokens.length;

        return matchRatio > 0.8; // Require 80% of product words to be in filename
    });

    if (bestMatch) {
        // Return relative path from public root
        return `/images/Fotos equipamentos/${bestMatch}`;
    }

    return undefined;
};
