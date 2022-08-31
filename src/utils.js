// @ts-check

const container = /**
 @type {HTMLElement}
 */ (document.getElementById("container"));

const templateImg = /**@type {HTMLTemplateElement}*/ (
  document.getElementById("templateImg")
);

/**
 * @typedef Response
 * @property {string} src
 * @property {string} category
 * @property {number} id
 */

/**
 * @returns {Promise<Response[]>}
 */

export const fetchData = async () => {
  try {
    const res = await fetch("api.json");
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
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
 * @param {Element | null} element
 */

const generateEventForImage = (element) => {
  if (!element) return;

  const checkboxInput = /**@type {HTMLInputElement}*/ (
    element.lastElementChild
  );

  const handleMouseClick = () => {
    if (!checkboxInput.classList.contains("visible-checkbox")) return;

    if (!checkboxInput.checked) {
      checkboxInput.checked = true;
    } else {
      checkboxInput.checked = false;
    }
  };

  element.addEventListener("click", handleMouseClick);
};

/**
 * @param {import('./types').Response} image
 */

export const printImg = (image) => {
  const { category, id, src } = image;
  const templateContent = templateImg.content;

  templateContent.querySelector("img")?.setAttribute("src", src);
  templateContent.querySelector("img")?.setAttribute("alt", category);
  templateContent.querySelector("div")?.setAttribute("id", String(id));

  const clone = templateContent.cloneNode(true);
  container.appendChild(clone);

  generateEventForImage(container.lastElementChild);
};
