import { availableProductImages } from '@/data/availableImages';

const normalize = (str: string) => {
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[^a-z0-9 ]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
};

export const findImageForProduct = (
    productName: string,
    productDescription?: string
): string | undefined => {
    if (!productName) return undefined;

    // Combine name + description for more precise matching
    const fullText = `${productName} ${productDescription || ''}`;
    const normalizedProduct = normalize(fullText);
    const productTokens = normalizedProduct.split(' ').filter(t => t.length > 2);

    let bestMatch: { filename: string; score: number } | null = null;

    for (const filename of availableProductImages) {
        const normalizedFile = normalize(filename.replace(/\.(jpg|png|webp)$/i, ''));
        const fileTokens = normalizedFile.split(' ').filter(t => t.length > 2);

        // Count matching tokens with flexible comparison
        const matchingTokens = productTokens.filter(token =>
            fileTokens.some(ft => ft.includes(token) || token.includes(ft))
        );

        // Calculate score based on matched tokens
        const score = matchingTokens.length / Math.max(Math.min(productTokens.length, 4), 1);

        if (score > 0.5 && (!bestMatch || score > bestMatch.score)) {
            bestMatch = { filename, score };
        }
    }

    if (bestMatch) {
        return `/images/fotos_equipamentos/${bestMatch.filename}`;
    }

    return undefined;
};
