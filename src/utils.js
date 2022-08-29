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