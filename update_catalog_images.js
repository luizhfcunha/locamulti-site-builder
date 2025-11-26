
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuration
const SUPABASE_URL = 'https://hdrqdfjxwohrnarbghed.supabase.co';
const SERVICE_ROLE_KEY = 'ffXEJ-CLw2a7VVB'; // PROVIDED BY USER
const IMAGES_DIR = String.raw`C:\Users\kssya\OneDrive\Documentos\Agencia Excalibur Ads\LocaMulti\Locamulti\Fotos Produtos 45 (800 x 600 px)`;
const BUCKET_NAME = 'product-images';

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function updateCatalog() {
    console.log('Starting catalog update...');

    if (!fs.existsSync(IMAGES_DIR)) {
        console.error(`Directory not found: ${IMAGES_DIR}`);
        return;
    }

    const files = fs.readdirSync(IMAGES_DIR).filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
    });

    console.log(`Found ${files.length} images to process.`);

    let successCount = 0;
    let errorCount = 0;
    let notFoundCount = 0;

    for (const file of files) {
        try {
            console.log(`\nProcessing: ${file}`);

            // 1. Prepare file and name
            const filePath = path.join(IMAGES_DIR, file);
            const fileBuffer = fs.readFileSync(filePath);
            const fileNameClean = path.basename(file, path.extname(file))
                .replace(/\s+\(\d+\)$/, '') // Remove trailing (2), (3) etc if desired, or keep them if they distinguish products. 
                // User said "Revise o nome do produto... se está de acordo com o nome da foto".
                // I will assume the filename IS the correct name.
                .trim();

            // 2. Upload to Storage
            // We'll use the original filename for storage to avoid collisions if possible, or a sanitized version.
            // Using a fixed path structure or just the filename.
            const storagePath = `${fileNameClean}-${Date.now()}${path.extname(file)}`;

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from(BUCKET_NAME)
                .upload(storagePath, fileBuffer, {
                    contentType: 'image/jpeg', // Assuming mostly jpg based on list, or detect mime type
                    upsert: true
                });

            if (uploadError) {
                throw new Error(`Upload failed: ${uploadError.message}`);
            }

            // 3. Get Public URL
            const { data: urlData } = supabase.storage
                .from(BUCKET_NAME)
                .getPublicUrl(storagePath);

            const publicUrl = urlData.publicUrl;
            console.log(`Uploaded to: ${publicUrl}`);

            // 4. Update Database
            // Strategy: Try to find product by name (fuzzy match) OR just update if exists.
            // Since user wants to "add photos... updating catalog" and "revise name", 
            // it implies matching existing records might be tricky if names don't match exactly.
            // However, if I can't find the product, I can't update it.
            // I'll try to match by `name` using `ilike`.

            // First, check if a product with this EXACT name exists (after cleaning).
            let { data: products, error: searchError } = await supabase
                .from('products')
                .select('id, name')
                .ilike('name', fileNameClean);

            if (searchError) {
                throw new Error(`Search failed: ${searchError.message}`);
            }

            if (!products || products.length === 0) {
                // Try a looser search? Or just report not found.
                // Maybe the catalog has "Alicate Hidraulico" and file is "ALICATE HIDRÁULICO...". ilike handles case.
                // But if catalog has "Alicate" and file is "Alicate Hidraulico", exact match fails.
                // Let's try to find by a significant part of the name if exact fail?
                // For now, let's stick to the cleaned filename as the target.
                console.warn(`[WARN] Product not found for: "${fileNameClean}"`);
                notFoundCount++;

                // OPTIONAL: Create product if not exists? 
                // User said "adicione as fotos no catálogo", maybe implies creating?
                // But creating requires category/subcategory which I don't have from just filename easily.
                // I will skip creation to avoid bad data, and just report.
                continue;
            }

            // If multiple found, update all? Or just first?
            // Usually one product per name.
            const product = products[0];

            const { error: updateError } = await supabase
                .from('products')
                .update({
                    image_url: publicUrl,
                    name: fileNameClean // Updating name as requested
                })
                .eq('id', product.id);

            if (updateError) {
                throw new Error(`Database update failed: ${updateError.message}`);
            }

            console.log(`[SUCCESS] Updated product: "${product.name}" -> "${fileNameClean}"`);
            successCount++;

        } catch (err) {
            console.error(`[ERROR] Failed to process ${file}:`, err.message);
            errorCount++;
        }
    }

    console.log('\n------------------------------------------------');
    console.log(`Finished. Success: ${successCount}, Errors: ${errorCount}, Not Found: ${notFoundCount}`);
}

updateCatalog().catch(console.error);
