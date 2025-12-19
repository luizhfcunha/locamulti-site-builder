/**
 * Fuzzy matching utilities for product image association
 */

/**
 * Normalize a string for comparison:
 * - Lowercase
 * - Remove accents
 * - Remove special characters
 * - Trim whitespace
 */
export const normalizeString = (str: string): string => {
  if (!str) return "";
  return str
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-z0-9\s]/g, " ") // Replace special chars with space
    .replace(/\s+/g, " ") // Collapse multiple spaces
    .trim();
};

/**
 * Extract tokens from a string for comparison
 */
export const tokenize = (str: string): string[] => {
  return normalizeString(str)
    .split(" ")
    .filter((token) => token.length > 1); // Ignore single characters
};

/**
 * Calculate similarity between two strings using token matching
 * Returns a value between 0 and 1
 */
export const calculateSimilarity = (s1: string, s2: string): number => {
  const tokens1 = tokenize(s1);
  const tokens2 = tokenize(s2);

  if (tokens1.length === 0 || tokens2.length === 0) return 0;

  let matchScore = 0;
  const usedTokens = new Set<number>();

  // For each token in s1, find the best match in s2
  for (const t1 of tokens1) {
    let bestMatch = 0;
    let bestIndex = -1;

    for (let i = 0; i < tokens2.length; i++) {
      if (usedTokens.has(i)) continue;
      const t2 = tokens2[i];

      // Exact match
      if (t1 === t2) {
        if (1 > bestMatch) {
          bestMatch = 1;
          bestIndex = i;
        }
      }
      // Partial match (one contains the other)
      else if (t1.includes(t2) || t2.includes(t1)) {
        const minLen = Math.min(t1.length, t2.length);
        const maxLen = Math.max(t1.length, t2.length);
        const score = minLen / maxLen;
        if (score > bestMatch) {
          bestMatch = score;
          bestIndex = i;
        }
      }
      // Levenshtein distance for close matches
      else {
        const distance = levenshteinDistance(t1, t2);
        const maxLen = Math.max(t1.length, t2.length);
        const score = 1 - distance / maxLen;
        if (score > 0.6 && score > bestMatch) {
          bestMatch = score;
          bestIndex = i;
        }
      }
    }

    if (bestIndex >= 0) {
      usedTokens.add(bestIndex);
      matchScore += bestMatch;
    }
  }

  // Normalize by the maximum possible matches
  const maxPossibleMatches = Math.max(tokens1.length, tokens2.length);
  return matchScore / maxPossibleMatches;
};

/**
 * Calculate Levenshtein distance between two strings
 */
export const levenshteinDistance = (s1: string, s2: string): number => {
  const m = s1.length;
  const n = s2.length;

  if (m === 0) return n;
  if (n === 0) return m;

  const matrix: number[][] = [];

  for (let i = 0; i <= m; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= n; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,      // deletion
        matrix[i][j - 1] + 1,      // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return matrix[m][n];
};

/**
 * Extract product-relevant parts from a filename
 * Removes common suffixes like brand names, numbers at the end, etc.
 */
export const extractProductName = (filename: string): string => {
  // Remove file extension
  let name = filename.replace(/\.[^.]+$/, "");
  
  // Remove common patterns like (1), (2), etc.
  name = name.replace(/\s*\(\d+\)\s*$/g, "");
  
  // Remove trailing numbers that might be duplicates
  name = name.replace(/\s+\d+\s*$/g, "");
  
  return name;
};

export interface MatchResult {
  product: any;
  similarity: number;
  confidence: "high" | "medium" | "low" | "none";
}

/**
 * Find the best product match for a given filename
 */
export const findBestMatch = (
  filename: string,
  products: any[]
): MatchResult | null => {
  if (!products || products.length === 0) return null;

  const cleanedFilename = extractProductName(filename);
  let bestMatch: MatchResult | null = null;

  for (const product of products) {
    // Compare with product name
    const nameSimilarity = calculateSimilarity(cleanedFilename, product.name || "");
    
    // Compare with supplier code if available
    let codeSimilarity = 0;
    if (product.supplier_code) {
      codeSimilarity = calculateSimilarity(cleanedFilename, product.supplier_code);
    }

    // Use the best score
    const similarity = Math.max(nameSimilarity, codeSimilarity);

    if (!bestMatch || similarity > bestMatch.similarity) {
      bestMatch = {
        product,
        similarity,
        confidence: getConfidenceLevel(similarity),
      };
    }
  }

  // Only return if we have at least some match
  if (bestMatch && bestMatch.similarity < 0.2) {
    return { ...bestMatch, confidence: "none" };
  }

  return bestMatch;
};

/**
 * Get confidence level based on similarity score
 */
export const getConfidenceLevel = (
  similarity: number
): "high" | "medium" | "low" | "none" => {
  if (similarity >= 0.7) return "high";
  if (similarity >= 0.5) return "medium";
  if (similarity >= 0.3) return "low";
  return "none";
};

/**
 * Get color class for confidence badge
 */
export const getConfidenceColor = (
  confidence: "high" | "medium" | "low" | "none"
): string => {
  switch (confidence) {
    case "high":
      return "bg-green-500 hover:bg-green-600";
    case "medium":
      return "bg-yellow-500 hover:bg-yellow-600";
    case "low":
      return "bg-orange-500 hover:bg-orange-600";
    case "none":
      return "bg-destructive hover:bg-destructive/90";
  }
};

/**
 * Get confidence label in Portuguese
 */
export const getConfidenceLabel = (
  confidence: "high" | "medium" | "low" | "none"
): string => {
  switch (confidence) {
    case "high":
      return "Alta";
    case "medium":
      return "Média";
    case "low":
      return "Baixa";
    case "none":
      return "Sem match";
  }
};
