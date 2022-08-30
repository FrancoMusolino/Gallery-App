// @ts-check

const container = /**
 @type {HTMLElement}
 */ (document.getElementById("container"));

const templateImg = /**@type {HTMLTemplateElement}*/ (
  document.getElementById("templateImg")
);

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
 * @param {string} key
 * @returns {import('./types').Response[] | null}
 */

export const getLS = (key) => {
  const imagesJSON = localStorage.getItem(key);
  const data = imagesJSON ? JSON.parse(imagesJSON) : null;
  return data;
};

/**
 * @param {string} key
 * @param {import('./types').Response[]} value
 * @returns {void}
 */

export const setLS = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

/**
 * @param {import('./types').Response} image
 */

export const printImg = (image) => {
  const templateContent = templateImg.content;

  templateContent.querySelector("img")?.setAttribute("src", image.src);
  templateContent.querySelector("img")?.setAttribute("alt", image.category);
  templateContent.querySelector("div")?.setAttribute("id", String(image.id));

  const clone = templateContent.cloneNode(true);
  container.appendChild(clone);
};
