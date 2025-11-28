import { supabase } from "@/integrations/supabase/client";

// Gerar ou recuperar session_id do sessionStorage
const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
};

// Extrair parâmetros UTM da URL
const getUtmParams = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get('utm_source'),
    utm_medium: params.get('utm_medium'),
    utm_campaign: params.get('utm_campaign'),
    utm_content: params.get('utm_content'),
  };
};

interface TrackEventParams {
  event_type: 'product_view' | 'whatsapp_click' | 'catalog_visit';
  product_id?: string;
  category_id?: string;
  subcategory_id?: string;
}

export const trackEvent = async ({
  event_type,
  product_id,
  category_id,
  subcategory_id,
}: TrackEventParams) => {
  try {
    const utm = getUtmParams();
    const sessionId = getSessionId();

    await supabase.from('analytics_events').insert({
      event_type,
      product_id: product_id || null,
      category_id: category_id || null,
      subcategory_id: subcategory_id || null,
      utm_source: utm.utm_source,
      utm_medium: utm.utm_medium,
      utm_campaign: utm.utm_campaign,
      utm_content: utm.utm_content,
      user_agent: navigator.userAgent,
      referrer: document.referrer || null,
      session_id: sessionId,
    });
  } catch (error) {
    // Fail silently - não queremos quebrar a UX por erros de tracking
    console.debug('Analytics tracking error:', error);
  }
};

// Hook para rastrear visualização de produto
export const useTrackProductView = (productId?: string) => {
  if (productId) {
    trackEvent({ event_type: 'product_view', product_id: productId });
  }
};

// Função para rastrear clique no WhatsApp
export const trackWhatsAppClick = (productId?: string) => {
  trackEvent({ 
    event_type: 'whatsapp_click', 
    product_id: productId || undefined 
  });
};
