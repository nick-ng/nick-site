import axios from 'axios';

axios.interceptors.request.use((config) => {
  const extraHeaders = {};

  // Add adminKey to request
  const adminKey = localStorage.getItem('adminKey');
  if (adminKey) {
    extraHeaders['x-admin-key'] = adminKey;
  }

  // Add weddingAlbumKey to request
  const weddingAlbumKey = localStorage.getItem('weddingAlbumKey');
  if (weddingAlbumKey) {
    extraHeaders['x-wedding-album-key'] = weddingAlbumKey;
  }

  return {
    ...config,
    headers: {
      ...config.headers,
      ...extraHeaders,
    },
  };
});
