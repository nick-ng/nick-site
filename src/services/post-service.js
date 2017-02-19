import uuidV4 from 'uuid/v4';

export default {
  makePost: (content) => {
    const id = uuidV4();
    return {
      [id]: {
        id,
        content,
        postDate: new Date(),
      },
    };
  },
};
