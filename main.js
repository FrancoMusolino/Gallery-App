const container = document.getElementById('container');
const templateImg = document.getElementById('templateImg').content;
const openButton = document.getElementById('open');
const closeButton = document.getElementById('close');
const ventanaModal = document.querySelector('.ventana-modal');
const selectCategories = document.getElementById('categories');
const addImg = document.getElementById('add');

let images = [];

document.addEventListener("DOMContentLoaded", () => {
    fetchData()
    if (localStorage.getItem('images')) {
        images = JSON.parse(localStorage.getItem('images'));
    }
});

// localStorage.setItem('images', JSON.stringify(images));

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

const introduceImg = data => {
    images = data;
    images.forEach(image => {
        templateImg.querySelector('img').setAttribute('src', image.src);
        templateImg.querySelector('img').setAttribute('alt', image.category);

        const clone = templateImg.cloneNode(true);
        container.appendChild(clone);
    });
}

openButton.addEventListener('click', () => ventanaModal.classList.add('visible'));
closeButton.addEventListener('click', () => ventanaModal.classList.remove('visible'));

const addImage = e => {
    e.preventDefault();
    if (selectCategories.value === "") {
        alert("Para agregar una imagen, debe seleccionar su categoría")
    } else {
        let category = selectCategories.value
        images.push({
            src: `https://placeimg.com/640/480/${category}`,
            alt: category,
            id: Date.now()
        })
        introduceNewImg();
    }
}

addImg.addEventListener('click', e => addImage(e))



