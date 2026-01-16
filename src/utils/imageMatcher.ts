import { availableProductImages } from '@/data/availableImages';

const normalize = (str: string) => {
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[^a-z0-9 ]/g, '')
        .trim();
};

export const findImageForProduct = (productName: string): string | undefined => {
    if (!productName) return undefined;

    const normalizedProduct = normalize(productName);

    const bestMatch = availableProductImages.find((filename) => {
        const normalizedFile = normalize(filename.replace(/\.jpg$/i, '').replace(/\.png$/i, ''));

        // Check strict inclusion
        if (normalizedFile.includes(normalizedProduct) || normalizedProduct.includes(normalizedFile)) {
            return true;
        }

        // Check if significant words match
        const productTokens = normalizedProduct.split(' ').filter(t => t.length > 2);
        const fileTokens = normalizedFile.split(' ').filter(t => t.length > 2);

        const matchingTokens = productTokens.filter(token => fileTokens.includes(token));
        const matchRatio = matchingTokens.length / productTokens.length;

        return matchRatio > 0.8;
    });

    if (bestMatch) {
        return `/images/fotos_equipamentos/${bestMatch}`;
    }

    return undefined;
};
