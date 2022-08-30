// @ts-check

/**
 * @returns {import('./types').Response[]}
 */

export const fetchData = async () => {
  try {
    const res = await fetch("api.json");
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

/**
 * @param {string} id
 * @returns {import('./types').Response[] | null}
 */

export const transformJSON = (id) => {
  const imagesJSON = localStorage.getItem(id);
  const data = imagesJSON ? JSON.parse(imagesJSON) : null;
  return data;
};
