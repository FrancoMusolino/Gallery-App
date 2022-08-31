// @ts-check

import { fetchData, getLS, printImg, setLS } from "./utils.js";

const container = /**
 @type {HTMLElement}
 */ (document.getElementById("container"));

const openButton = /**@type {HTMLElement}*/ (document.getElementById("open"));

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

const deleteImg = /**@type {HTMLElement}*/ (
  document.getElementById("delete-image")
);

const trashIcon = /**@type {HTMLButtonElement}*/ (
  document.getElementById("trash-icon")
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

  addInitialImages(images);
});

/**
 * @param {import('./types').Response[]} images
 */

const addInitialImages = (images) => {
  images.forEach((image) => {
    printImg(image);
  });
};

openButton.addEventListener("click", () =>
  ventanaModal.classList.add("visible")
);

closeButton.addEventListener("click", () => {
  ventanaModal.classList.remove("visible");
  selectCategories.value = "";
});

const toggleDeleteVisibility = () => {
  trashIcon.classList.toggle("navbar__icon--animation");
  deleteContainer.classList.toggle("delete-container--visible");
};

/**
 * @param {MouseEvent} e
 */

const addImage = (e) => {
  e.preventDefault();

  if (selectCategories.value === "") {
    return alert("Para agregar una imagen, debe seleccionar su categoría");
  }

  /**@type {string} */

  let category = selectCategories.value;

  /**@type {import('./types').Response} */

  let newImage = {
    src: `https://placeimg.com/640/480/${category}`,
    category,
    id: +new Date(),
  };

  printImg(newImage);
  images.push(newImage);

  ventanaModal.classList.remove("visible");
  selectCategories.value = "";

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

    image.addEventListener("click", () => {
      if (!checkboxInput.classList.contains("visible-checkbox")) {
        return;
      }

      if (!checkboxInput.checked) {
        checkboxInput.checked = true;
      } else {
        checkboxInput.checked = false;
      }
    });
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

    /**
     * @type {number}
     */

    const ID = +image.getAttribute("id");

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

    images.forEach((image) => {
      printImg(image);
    });

    setLS("images", images);

    toggleDeleteVisibility();
  }
};

deleteButton.addEventListener("click", deleteImages);

const cancelImgDelete = () => {
  deleteContainer.classList.remove("delete-container--visible");
  trashIcon.classList.remove("navbar__icon--animation");
  const imagesInDom = document.querySelectorAll(".template-img__container");
  imagesInDom.forEach((item) => {
    const itemCheckbox = item.querySelector("input");
    if (itemCheckbox.getAttribute("checked")) {
      itemCheckbox.removeAttribute("checked");
    }
    itemCheckbox.classList.remove("visible-checkbox");
  });
};

cancelButton.addEventListener("click", cancelImgDelete);
