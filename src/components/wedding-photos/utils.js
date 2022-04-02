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

export const getUniqueTags = (photos) => {
  const uniqueTags = new Set();

  photos
    .map((a) => a.tags)
    .forEach((tags) => {
      tags.forEach((tag) => {
        uniqueTags.add(tag.displayName);
      });
    });

  return [...uniqueTags];
};

export const makeTagFilter = (selectedTags) => (photo) => {
  return selectedTags.some((tag) =>
    photo.tags.map((a) => a.displayName).includes(tag)
  );
};
