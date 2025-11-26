import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface UploadResult {
  filename: string;
  success: boolean;
  url?: string;
  error?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Criar cliente Supabase com service_role para bypass RLS
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Criar cliente regular para validação de usuário
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_PUBLISHABLE_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader }
        }
      }
    );

    // Verificar autenticação
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    
    if (authError || !user) {
      console.error('Auth error:', authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verificar se é admin
    const { data: roleData, error: roleError } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    if (roleError || !roleData) {
      console.error('Role check error:', roleError);
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Admin user ${user.email} authenticated for bulk upload`);

    // Processar FormData
    const formData = await req.formData();
    const files = formData.getAll('files');

    if (!files || files.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No files provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing ${files.length} files...`);

    const results: UploadResult[] = [];

    // Upload cada arquivo
    for (const file of files) {
      if (!(file instanceof File)) {
        results.push({
          filename: 'unknown',
          success: false,
          error: 'Invalid file format'
        });
        continue;
      }

      const filename = file.name;
      const fileExt = filename.split('.').pop()?.toLowerCase();

      // Validar tipo de arquivo
      if (!fileExt || !['jpg', 'jpeg', 'png', 'webp'].includes(fileExt)) {
        results.push({
          filename,
          success: false,
          error: `Invalid file type: ${fileExt}`
        });
        continue;
      }

      // Validar tamanho (10MB)
      if (file.size > 10 * 1024 * 1024) {
        results.push({
          filename,
          success: false,
          error: 'File too large (max 10MB)'
        });
        continue;
      }

      try {
        // Gerar nome único
        const timestamp = Date.now();
        const uniqueFilename = `${timestamp}-${filename}`;
        const arrayBuffer = await file.arrayBuffer();
        const fileBuffer = new Uint8Array(arrayBuffer);

        // Upload usando service_role para bypass de políticas
        const { data, error } = await supabaseAdmin.storage
          .from('product-images')
          .upload(uniqueFilename, fileBuffer, {
            contentType: file.type,
            upsert: false
          });

        if (error) {
          console.error(`Upload error for ${filename}:`, error);
          results.push({
            filename,
            success: false,
            error: error.message
          });
          continue;
        }

        // Gerar URL pública
        const publicUrl = `${Deno.env.get('SUPABASE_URL')}/storage/v1/object/public/product-images/${data.path}`;

        console.log(`Successfully uploaded: ${filename} -> ${publicUrl}`);

        results.push({
          filename,
          success: true,
          url: publicUrl
        });
      } catch (err) {
        console.error(`Exception uploading ${filename}:`, err);
        results.push({
          filename,
          success: false,
          error: err instanceof Error ? err.message : 'Unknown error'
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;

    console.log(`Upload complete: ${successCount} success, ${failCount} failed`);

    return new Response(
      JSON.stringify({
        message: `Upload complete: ${successCount} success, ${failCount} failed`,
        results
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Internal server error' 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
