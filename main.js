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

const deleteImg = () => {

}

const introduceImg = data => {
    if (localStorage.getItem('images')) {
        images = JSON.parse(localStorage.getItem('images'))
    } else {
        images = data;
    }
    images.forEach(image => {
        templateImg.querySelector('img').setAttribute('src', image.src);
        templateImg.querySelector('img').setAttribute('alt', image.category);

        if (image.id < 10) {
            templateImg.querySelector('.delete-container').style.visibility = "hidden";
        } else {
            templateImg.querySelector('.delete-container').style.visibility = "visible";

            // No toma el deleteContainer como un elemento válido para realizar el evento click

            // const deleteContainer = document.getElementById('delete-container');
            // console.log(deleteContainer)
            // deleteContainer.addEventListener('click', () => console.log("entre"));
        }

        const clone = templateImg.cloneNode(true);
        container.appendChild(clone);
    });
}

openButton.addEventListener('click', () => ventanaModal.classList.add('visible'));
closeButton.addEventListener('click', () => ventanaModal.classList.remove('visible'));

const introduceNewImg = () => {
    let newItem = images.pop()
    templateImg.querySelector('img').setAttribute('src', newItem.src);
    templateImg.querySelector('img').setAttribute('alt', newItem.category);

    const clone = templateImg.cloneNode(true);
    container.appendChild(clone);
}

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
        ventanaModal.classList.remove('visible');
        localStorage.setItem('images', JSON.stringify(images));
        introduceNewImg();
    }
}

addImg.addEventListener('click', e => addImage(e));



