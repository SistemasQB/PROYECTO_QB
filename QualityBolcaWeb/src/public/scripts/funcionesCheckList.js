let bateria = document.getElementById('checkBateria');
let sin = document.getElementById('sinBateria');
let conCat = document.getElementById('ConCat');
let SinCat = document.getElementById('SinCat');
let selunidad = document.getElementById('UNIDAD');
let imgUnidad = document.getElementById('imgUnidad');


let etiqueta1 = document.getElementById('em');
let etiqueta2 = document.getElementById('es');
let etiqueta3 = document.getElementById('ec');
let etiqueta4 = document.getElementById('esc');


selunidad.addEventListener('change', (e) => {
    var index = e.target.selectedIndex;
    console.log(index);
    
    switch (index) {
        case 0:
        imgUnidad.src = `../img/unidad1.jpg`;
            break;
        case 1:
            imgUnidad.src = `../img/unidad3.jpg`;
            break;
        case 2:
            imgUnidad.src = `../img/unidad2.jpg`;
            break;
    }
})

bateria.addEventListener('click', () => {
    if (bateria.checked) {
        let marca = document.getElementById('marcaBateria')
        let serie = document.getElementById('SerieBateria')
        marca.style.display = 'block'
        serie.style.display = 'block'
        marca.value = ''
        serie.value = ''
        etiqueta1.style.display = 'block'
        etiqueta2.style.display = 'block'
    }

});
sin.addEventListener('click', () => {
    if (sin.checked) {
        let marca = document.getElementById('marcaBateria')
        let serie = document.getElementById('SerieBateria')
        marca.style.display = 'none'
        serie.style.display = 'none'
        marca.value = 'N/A'
        serie.value = 'N/A'
        etiqueta1.style.display = 'none'
        etiqueta2.style.display = 'none'
    }

});

conCat.addEventListener('click', () => {
    if (conCat.checked) {
        let mCat = document.getElementById('marcaCatalizador');
        let sCat = document.getElementById('SerieCatalizador');
        mCat.style.display = 'block'
        sCat.style.display = 'block'
        etiqueta3.style.display = 'block'
        etiqueta4.style.display = 'block'
    }


})
SinCat.addEventListener('click', () => {
    if (SinCat.checked) {
        let mCat = document.getElementById('marcaCatalizador');
        let sCat = document.getElementById('SerieCatalizador');
        mCat.style.display = 'none'
        sCat.style.display = 'none'
        etiqueta3.style.display = 'none'
        etiqueta4.style.display = 'none'
    }
})



