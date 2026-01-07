import { read, utils } from 'xlsx';
import { Product } from '@/types/catalog';

interface ExcelProductRow {
    ordem_categoria: number;
    CATEGORIA: string;
    Ordem_família: string;
    FAMÍLIA: string;
    ordem_equipamento: string;
    EQUIPAMENTO: string;
    DESCRIÇÃO: string;
}

export const parseCatalogExcel = async (file: File): Promise<Product[]> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = e.target?.result;
                const workbook = read(data, { type: 'binary' });
                const sheetName = workbook.SheetNames[0]; // Assume first sheet
                const worksheet = workbook.Sheets[sheetName];

                // Parse to JSON using generic types first
                const rawData = utils.sheet_to_json<any>(worksheet);

                // Map to our Product structure
                const products: Product[] = rawData.map((row: any) => {
                    // Normalize description (handle potential checks for "CONSUMÍVEL")
                    const description = row['DESCRIÇÃO'] || '';
                    const isConsumable = description.toUpperCase().includes('CONSUMÍVEL');

                    return {
                        id: String(row['ordem_equipamento'] || ''),
                        order: String(row['ordem_equipamento'] || ''),
                        name: String(row['EQUIPAMENTO'] || ''),
                        description: description,
                        isConsumable: isConsumable,
                        category: String(row['CATEGORIA'] || ''),
                        categoryOrder: row['ordem_categoria'] || 0,
                        family: String(row['FAMÍLIA'] || ''),
                        familyOrder: String(row['Ordem_família'] || ''),
                        // Helper fields for URL generation, would ideally be slugified here or in usage
                        categorySlug: String(row['CATEGORIA'] || '').toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
                        familySlug: String(row['FAMÍLIA'] || '').toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
                    };
                }).filter(p => p.id && p.name); // valid rows only

                resolve(products);
            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = (error) => reject(error);
        reader.readAsBinaryString(file);
    });
};
