// @ts-check

import { fetchData, getLS, printImg, setLS } from "./utils.js";

const container = /**
 @type {HTMLElement}
 */ (document.getElementById("container"));

const openButton = /**@type {HTMLButtonElement}*/ (
  document.getElementById("add")
);

const closeButton = /**@type {HTMLButtonElement}*/ (
  document.getElementById("close")
);

const ventanaModal = /**@type {HTMLElement}*/ (
  document.querySelector(".ventana-modal")
);

const selectCategories = /**@type {HTMLSelectElement}*/ (
  document.getElementById("categories")
);

const addImg = /**@type {HTMLButtonElement}*/ (
  document.getElementById("add-button")
);

const deleteImg = /**@type {HTMLButtonElement}*/ (
  document.getElementById("delete")
);

const deleteContainer = /**@type {HTMLElement}*/ (
  document.getElementById("delete-container")
);

const deleteButton = /**@type {HTMLButtonElement}*/ (
  document.getElementById("delete-button")
);

const cancelButton = /**@type {HTMLButtonElement}*/ (
  document.getElementById("cancel-button")
);

const overlay = /**@type {HTMLElement}*/ (document.getElementById("overlay"));

/** @type {import('./types').Response[]} */

let images;

document.addEventListener("DOMContentLoaded", async () => {
  const dataInLS = getLS("images");

  if (dataInLS) {
    images = dataInLS;
  } else {
    try {
      const data = await fetchData();
      images = data;
    } catch (error) {
      console.error(error);
      return;
    }
  }

  addImages(images);
});

/**
 * @param {import('./types').Response[]} images
 */

const addImages = (images) => {
  images.forEach((image) => {
    printImg(image);
  });
};

const toggleDeleteVisibility = () => {
  deleteContainer.classList.toggle("delete-container--visible");
};

const handleToggleVisibility = () => {
  ventanaModal.classList.toggle("visible");
  overlay.classList.toggle("overlay-visible");
  selectCategories.value = "";

  const checkboxs = /**@type {NodeListOf<HTMLInputElement>}*/ (
    document.querySelectorAll("#select-image")
  );

  checkboxs.forEach((checkbox) => {
    if (checkbox.classList.contains("visible-checkbox")) {
      checkbox.classList.remove("visible-checkbox");
      checkbox.checked = false;
    }
  });
};

openButton.addEventListener("click", handleToggleVisibility);

closeButton.addEventListener("click", handleToggleVisibility);

overlay.addEventListener("click", handleToggleVisibility);

/**
 * @param {MouseEvent} e
 */

const addImage = (e) => {
  e.preventDefault();

  if (selectCategories.value === "") {
    return alert("Para agregar una imagen, debe seleccionar su categoría");
  }

  /**@type {string} */

  const category = selectCategories.value;

  /**@type {import('./types').Response} */

  const newImage = {
    src: `https://placeimg.com/640/480/${category}`,
    category,
    id: +new Date(),
  };

  printImg(newImage);
  images.push(newImage);

  handleToggleVisibility();

  setLS("images", images);
};

addImg.addEventListener("click", (e) => addImage(e));

const openCheckbox = () => {
  if (!images.length) {
    return alert("No hay imágenes para eliminar");
  }

  toggleDeleteVisibility();

  const imagesInDom = /**@type {NodeListOf<HTMLElement>}*/ (
    document.querySelectorAll(".template-img__container")
  );

  imagesInDom.forEach((image) => {
    const checkboxInput = /**@type {HTMLInputElement}*/ (
      image.lastElementChild
    );

    checkboxInput.classList.toggle("visible-checkbox");
    checkboxInput.checked = false;
  });
};

deleteImg.addEventListener("click", openCheckbox);

const deleteImages = () => {
  const imagesInDom = /**@type {NodeListOf<HTMLElement>}*/ (
    document.querySelectorAll(".template-img__container")
  );

  /**
   * @type {number[]}
   */

  let inputsChecked = [];

  imagesInDom.forEach((image) => {
    const checkboxInput = /**@type {HTMLInputElement}*/ (
      image.lastElementChild
    );

    const idAtttibute = image.getAttribute("id");

    /**
     * @type {number}
     */
    let ID = 0;

    if (idAtttibute) {
      ID = +idAtttibute;
    }

    if (checkboxInput.checked) {
      inputsChecked = [...inputsChecked, ID];
    }
  });

  if (!inputsChecked.length) {
    return alert("No hay imágenes seleccionadas para eliminar");
  }

  /**
   * @type {boolean}
   */

  const auth =
    inputsChecked.length === 1
      ? confirm("¿Desea eliminar la imagen?")
      : confirm(`¿Desea eliminar las ${inputsChecked.length} imágenes?`);

  if (auth) {
    images = images.filter((image) => !inputsChecked.includes(image.id));

    while (!!container.firstElementChild) {
      container.removeChild(container.firstElementChild);
    }

    addImages(images);

    setLS("images", images);

    toggleDeleteVisibility();
  }
};

deleteButton.addEventListener("click", deleteImages);

const cancelImgDelete = () => {
  toggleDeleteVisibility();

  const inputsCheckbox = /**@type {NodeListOf<HTMLInputElement>}*/ (
    document.querySelectorAll("#select-image")
  );

  inputsCheckbox.forEach((input) => {
    input.checked = false;
    input.classList.remove("visible-checkbox");
  });
};

cancelButton.addEventListener("click", cancelImgDelete);
