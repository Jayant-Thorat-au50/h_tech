const DEFAULT_WHATSAPP = '919372049568';

export const buildWhatsAppUrl = (message = '', phone = DEFAULT_WHATSAPP) => {
  const cleanPhone = String(phone || DEFAULT_WHATSAPP).replace(/[^0-9]/g, '') || DEFAULT_WHATSAPP;
  const encoded = encodeURIComponent(
    message || 'Hello H-Tech Computer Wholesale (Karad), I would like to enquire about wholesale dealer pricing.'
  );
  return `https://wa.me/${cleanPhone}?text=${encoded}`;
};

export const buildProductWhatsAppUrl = (productName, phone = DEFAULT_WHATSAPP) => {
  const msg = `Hello H-Tech Computer Wholesale (Karad), I would like to enquire about availability and dealer pricing for: *${productName}*.`;
  return buildWhatsAppUrl(msg, phone);
};
