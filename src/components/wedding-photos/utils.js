export const addTagsToPhotos = (photos, photoTags) => {
  return photos.map((photo) => {
    const matchingTags = photoTags.filter((tag) => tag.uri === photo.file.url);

    return {
      ...photo,
      tags: matchingTags,
      sortOrder: Math.min(...matchingTags.map((a) => a.sortOrder), Infinity),
    };
  });
};
