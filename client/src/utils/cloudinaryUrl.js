export const optimizeImageUrl = (url, width = 800) => {
  if (!url || typeof url !== 'string') return '/brand/logo-fallback.svg';
  if (url.startsWith('data:') || url.startsWith('/')) return url;
  if (url.includes('res.cloudinary.com') && url.includes('/upload/')) {
    return url.replace('/upload/', `/upload/f_auto,q_auto,w_${width}/`);
  }
  return url;
};
