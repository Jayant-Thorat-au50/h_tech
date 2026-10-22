import { v2 as cloudinary } from 'cloudinary';
import { env } from './env.js';

const hasCloudinary =
  Boolean(env.CLOUDINARY_CLOUD_NAME) &&
  Boolean(env.CLOUDINARY_API_KEY) &&
  Boolean(env.CLOUDINARY_API_SECRET);

if (hasCloudinary) {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export const uploadBufferToCloudinary = async (buffer, mimetype, folder = 'htech_wholesale') => {
  if (hasCloudinary) {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
          transformation: [{ quality: 'auto', fetch_format: 'auto' }],
        },
        (error, result) => {
          if (error) return reject(error);
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        }
      );
      stream.end(buffer);
    });
  }

  // Fallback for local development without Cloudinary keys: data URL + generated publicId
  const base64 = buffer.toString('base64');
  const dataUrl = `data:${mimetype};base64,${base64}`;
  return {
    url: dataUrl,
    publicId: `local_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
  };
};

export const deleteFromCloudinary = async (publicId) => {
  if (!publicId || publicId.startsWith('local_') || publicId.startsWith('seed_')) {
    return { result: 'ok' };
  }
  if (hasCloudinary) {
    try {
      return await cloudinary.uploader.destroy(publicId);
    } catch (err) {
      console.warn('Cloudinary destroy warning:', err.message);
      return { result: 'error' };
    }
  }
  return { result: 'ok' };
};
