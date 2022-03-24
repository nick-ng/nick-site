export const addTagsToPhotos = (photos, photoTags) => {
  return photos.map((photo) => {
    const matchingTags = photoTags.filter((tag) => tag.uri === photo.file.url);

    const sortOrder =
      matchingTags.length > 0
        ? Math.min(...matchingTags.map((a) => a.sortOrder))
        : 1000000;

    return {
      ...photo,
      tags: matchingTags,
      sortOrder,
    };
  });
};
