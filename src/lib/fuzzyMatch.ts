/**
 * Fuzzy matching utilities for product image association
 */

/**
 * Match types for categorizing how matches were found
 */
export type MatchType = "model_code" | "equipment_name" | "fuzzy" | "none";

export interface MatchResult {
  product: any;
  similarity: number;
  confidence: "high" | "medium" | "low" | "none";
  matchType: MatchType;
  detectedCodes?: string[];
  detectedEquipment?: string;
}

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
 * Known equipment types in Portuguese for better matching
 */
const EQUIPMENT_PATTERNS = [
  "martelo demolidor", "martelo rompedor", "martelo perfurador", "martelete perfurador",
  "furadeira de impacto", "furadeira metal madeira", "furadeira base magnetica", "furadeira de mourao",
  "esmerilhadeira angular", "esmeril reto", "esmerilhadeira",
  "lixadeira angular", "lixadeira de parede", "lixadeira de teto", "lixadeira roto orbital", "lixadeira excentrica",
  "perfuratriz diamantada", "perfurador de solo",
  "compactador de percussao", "placa vibratoria",
  "betoneira", "alisadora de piso", "regua vibratoria",
  "gerador gasolina", "gerador diesel",
  "compressor ar", "compressor",
  "hidrolavadora eletrica", "hidrolavadora gasolina",
  "inversor de solda", "maquina de solda", "retificador de solda", "transformador de solda",
  "cortador de grama", "motosserra", "podador", "nebulizador",
  "aspirador de po", "enceradeira", "politriz de piso", "politriz eletronica",
  "bomba submersivel", "motobomba",
  "talha manual", "guincho", "empilhadeira", "carro trolley", "macaco garrafa", "macaco unha",
  "escada extensivel", "escada tesoura", "escada multiuso",
  "nivel a laser", "multicortadora", "policorte", "cortadora de piso", "cortadora de azulejo",
  "parafusadeira", "chave de impacto", "chave grifo",
  "prensa hidraulica", "cilindro hidraulico", "bomba hidraulica", "alicate hidraulico",
  "carrinho plataforma", "carrinho de gas", "cinto de seguranca",
  "pistola de pintura", "maquina de plasma",
  "retifica", "plaina",
];

/**
 * Extract model codes from text (e.g., D25960K, GSB 30-2, DWE1622)
 */
export const extractModelCodes = (text: string): string[] => {
  if (!text) return [];
  
  // Clean up text for better matching
  const cleanText = text.toUpperCase().replace(/[,]/g, ' ');
  
  const patterns = [
    // DeWalt patterns: D25960K, DWE1622, DCF922, DW505
    /\b(D[A-Z]?[CWE]?\d{3,5}[A-Z]?[KB]?\d?)\b/gi,
    // Bosch patterns: GSB 30-2, GEX 125-1, GOP 250
    /\b(G[A-Z]{1,2}[SBEXOP]\s?\d{2,4}[\s-]?\d?[A-Z]?)\b/gi,
    // Generic model patterns: 4 digits with optional letters
    /\b([A-Z]{2,4}[\s-]?\d{3,5}[A-Z]?)\b/gi,
    // Toyama patterns: TPT900, TG3800, TCC450
    /\b(T[A-Z]{1,3}\d{3,4}[A-Z]?)\b/gi,
    // Karcher patterns: HD585, NT20-1
    /\b([A-Z]{2}\d{2,3}[-]?\d?)\b/gi,
    // ESAB patterns: 426, 406, 328
    /\b(ORIGO\s?(ARC\s?)?\d{3})\b/gi,
    // Generic numeric codes with letters: 25960K, 1622K
    /\b(\d{4,5}[A-Z])\b/gi,
    // Short alphanumeric: S160, K4000
    /\b([A-Z]\d{3,4}[A-Z]?)\b/gi,
  ];
  
  const codes: string[] = [];
  for (const pattern of patterns) {
    const matches = cleanText.match(pattern);
    if (matches) {
      codes.push(...matches.map(c => c.replace(/[\s-]/g, '').toUpperCase()));
    }
  }
  
  // Remove duplicates and common false positives
  const filtered = [...new Set(codes)].filter(code => {
    // Filter out pure numbers and very short codes
    if (/^\d+$/.test(code)) return false;
    if (code.length < 3) return false;
    // Filter common non-model strings
    if (['POL', 'MAX', 'PRO', 'KG', 'MM', 'PCM'].includes(code)) return false;
    return true;
  });
  
  return filtered;
};

/**
 * Extract main equipment name from text
 */
export const extractMainEquipmentName = (text: string): string | null => {
  if (!text) return null;
  
  const normalized = normalizeString(text);
  
  // Find the longest matching equipment pattern
  let bestMatch: string | null = null;
  for (const pattern of EQUIPMENT_PATTERNS) {
    if (normalized.includes(pattern)) {
      if (!bestMatch || pattern.length > bestMatch.length) {
        bestMatch = pattern;
      }
    }
  }
  
  return bestMatch;
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
 * Enhanced matching algorithm that prioritizes model codes
 */
export const findBestMatchEnhanced = (
  filename: string,
  products: any[]
): MatchResult | null => {
  if (!products || products.length === 0) return null;

  const cleanedFilename = extractProductName(filename);
  const fileModelCodes = extractModelCodes(cleanedFilename);
  const fileEquipmentName = extractMainEquipmentName(cleanedFilename);
  
  let bestMatch: MatchResult | null = null;

  for (const product of products) {
    const productName = product.name || "";
    const productCode = product.supplier_code || "";
    
    // Extract identifiers from product
    const productModelCodes = extractModelCodes(productName);
    const productEquipmentName = extractMainEquipmentName(productName);
    
    let similarity = 0;
    let matchType: MatchType = "none";
    
    // PRIORITY 1: Exact model code match (highest confidence)
    const codeMatch = fileModelCodes.some(fc => 
      productModelCodes.some(pc => {
        // Exact match
        if (fc === pc) return true;
        // One contains the other (for variations like D25960 vs D25960K)
        if (fc.length >= 4 && pc.length >= 4) {
          if (fc.includes(pc) || pc.includes(fc)) return true;
        }
        return false;
      })
    );
    
    if (codeMatch) {
      similarity = 0.9;
      matchType = "model_code";
      
      // Additional bonus if equipment name also matches
      if (fileEquipmentName && productEquipmentName && fileEquipmentName === productEquipmentName) {
        similarity = 0.95;
      }
    } else {
      // PRIORITY 2: Equipment name match
      if (fileEquipmentName && productEquipmentName && fileEquipmentName === productEquipmentName) {
        similarity = 0.6;
        matchType = "equipment_name";
        
        // Add fuzzy bonus for additional token matches
        const fuzzySimilarity = calculateSimilarity(cleanedFilename, productName);
        similarity += fuzzySimilarity * 0.2;
      } else {
        // PRIORITY 3: Fuzzy matching fallback
        const fuzzySimilarity = calculateSimilarity(cleanedFilename, productName);
        similarity = fuzzySimilarity;
        matchType = fuzzySimilarity > 0.3 ? "fuzzy" : "none";
      }
    }

    if (!bestMatch || similarity > bestMatch.similarity) {
      bestMatch = {
        product,
        similarity,
        confidence: getConfidenceLevel(similarity),
        matchType,
        detectedCodes: fileModelCodes,
        detectedEquipment: fileEquipmentName || undefined,
      };
    }
  }

  // Only return if we have at least some reasonable match
  if (bestMatch && bestMatch.similarity < 0.2) {
    return { 
      ...bestMatch, 
      confidence: "none",
      matchType: "none"
    };
  }

  return bestMatch;
};

/**
 * Legacy function for backwards compatibility
 */
export const findBestMatch = (
  filename: string,
  products: any[]
): MatchResult | null => {
  return findBestMatchEnhanced(filename, products);
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

/**
 * Get match type label in Portuguese
 */
export const getMatchTypeLabel = (matchType: MatchType): string => {
  switch (matchType) {
    case "model_code":
      return "Código";
    case "equipment_name":
      return "Equipamento";
    case "fuzzy":
      return "Similaridade";
    case "none":
      return "Manual";
  }
};

/**
 * Get match type color for UI
 */
export const getMatchTypeColor = (matchType: MatchType): string => {
  switch (matchType) {
    case "model_code":
      return "bg-emerald-500 hover:bg-emerald-600";
    case "equipment_name":
      return "bg-blue-500 hover:bg-blue-600";
    case "fuzzy":
      return "bg-amber-500 hover:bg-amber-600";
    case "none":
      return "bg-slate-400 hover:bg-slate-500";
  }
};
