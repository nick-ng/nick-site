export const hasAdminKey = () => Boolean(localStorage.getItem('adminKey'));

export const sleep = (ms) =>
  new Promise((res) => {
    setTimeout(res, ms);
  });
