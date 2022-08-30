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
  if (images.length === 0) {
    alert("No hay imágenes para eliminar");
  } else {
    trashIcon.classList.toggle("navbar__icon--animation");
    deleteContainer.classList.toggle("delete-container--visible");
    const imagesInDom = document.querySelectorAll(".template-img__container");
    imagesInDom.forEach((item) => {
      const itemCheckbox = item.querySelector("input");
      itemCheckbox.classList.toggle("visible-checkbox");

      item.addEventListener("click", () => {
        if (!itemCheckbox.getAttribute("checked")) {
          itemCheckbox.setAttribute("checked", true);
        } else {
          itemCheckbox.removeAttribute("checked");
        }
      });
    });
  }
};

deleteImg.addEventListener("click", openCheckbox);

const deleteItemOfArray = (id) => {
  let newId = parseInt(id);
  let newImages = images.filter((el) => el.id !== newId);
  images = newImages;
  localStorage.setItem("images", JSON.stringify(newImages));
};

const deleteImage = () => {
  const imagesInDom = document.querySelectorAll(".template-img__container");
  let contador = 0;
  imagesInDom.forEach((item) => {
    const itemCheckbox = item.querySelector("input");
    if (itemCheckbox.checked) {
      contador++;
    }
  });

  if (contador === 0) {
    alert("No hay imágenes seleccionadas para eliminar");
    return;
  }

  let auth =
    contador === 1
      ? confirm("¿Desea eliminar la imagen?")
      : confirm(`¿Desea eliminar las ${contador} imágenes?`);

  if (auth) {
    imagesInDom.forEach((item) => {
      const itemCheckbox = item.querySelector("input");
      if (itemCheckbox.checked) {
        let itemId = item.getAttribute("id");
        deleteItemOfArray(itemId);
        container.removeChild(item);
      }
      itemCheckbox.classList.remove("visible-checkbox");
    });
    deleteContainer.classList.remove("delete-container--visible");
    trashIcon.classList.remove("navbar__icon--animation");
  }
};

deleteButton.addEventListener("click", deleteImage);

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
