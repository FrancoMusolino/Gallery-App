const container = document.getElementById('container');
const templateImg = document.getElementById('templateImg').content;
const openButton = document.getElementById('open');
const closeButton = document.getElementById('close');
const ventanaModal = document.querySelector('.ventana-modal');
const selectCategories = document.getElementById('categories');
const addImg = document.getElementById('add-button');
const deleteImg = document.getElementById('delete-image');
const deleteButton = document.getElementById('delete-container');

let images = [];

const fetchData = async () => {
    try {
        const res = await fetch('api.json');
        const data = await res.json();
        introduceImg(data);
    }
    catch (error) {
        console.error(error);
    }
}

document.addEventListener("DOMContentLoaded", fetchData);

const introduceImg = data => {
    if (localStorage.getItem('images')) {
        images = JSON.parse(localStorage.getItem('images'))
    } else {
        images = data;
    }

    images.forEach(image => {
        templateImg.querySelector('img').setAttribute('src', image.src);
        templateImg.querySelector('img').setAttribute('alt', image.category);
        templateImg.querySelector('div').setAttribute('id', image.id)

        const clone = templateImg.cloneNode(true);
        container.appendChild(clone);
    });
}

openButton.addEventListener('click', () => ventanaModal.classList.add('visible'));

closeButton.addEventListener('click', () => {
    ventanaModal.classList.remove('visible');
    selectCategories.value = "";
});

const introduceNewImg = () => {
    let newItem = images.pop()
    templateImg.querySelector('img').setAttribute('src', newItem.src);
    templateImg.querySelector('img').setAttribute('alt', newItem.category);
    templateImg.querySelector('div').setAttribute('id', newItem.id)


    const clone = templateImg.cloneNode(true);
    container.appendChild(clone);
}

const addImage = e => {
    e.preventDefault();
    if (selectCategories.value === "") {
        alert("Para agregar una imagen, debe seleccionar su categoría")
    } else {
        let category = selectCategories.value;

        /* Agrega una imagen al mismo array, por eso nunca suma más de 1 */

        images.push({
            src: `https://placeimg.com/640/480/${category}`,
            alt: category,
            id: Date.now()
        })
        ventanaModal.classList.remove('visible');
        selectCategories.value = "";
        localStorage.setItem('images', JSON.stringify(images));
        introduceNewImg();
    }
}

addImg.addEventListener('click', e => addImage(e));

const openCheckbox = () => {
    const imagesInDom = document.querySelectorAll('.template-img__container');
    imagesInDom.forEach(item => {
        const itemCheckbox = item.querySelector('input');
        if (item.getAttribute('id') > 10) {
            itemCheckbox.classList.add('visible-checkbox');
        }

        item.addEventListener('click', () => {
            if (!itemCheckbox.getAttribute('checked')) {
                itemCheckbox.setAttribute('checked', true);
            } else {
                itemCheckbox.removeAttribute('checked');
            }
        });
    });

    deleteButton.classList.add('delete-container--visible');
}

deleteImg.addEventListener('click', openCheckbox);

const deleteImage = () => {
    const imagesInDom = document.querySelectorAll('.template-img__container');
    let auth = confirm('¿Seguro desea eliminar las imágenes?');

    if (auth) {
        imagesInDom.forEach(item => {
            const itemCheckbox = item.querySelector('input');
            if (itemCheckbox.checked) {
                let itemId = item.getAttribute('id');
                container.removeChild(item);
                let newImages = images.filter(image => image.id !== itemId);
                localStorage.setItem('images', JSON.stringify(newImages));
            }
        })
    }
}

deleteButton.addEventListener('click', deleteImage);