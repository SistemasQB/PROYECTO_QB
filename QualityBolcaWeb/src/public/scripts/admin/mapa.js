(function() {
    const lat = 20.67444163271174;
    const lng = -103.38739216304566;
    const mapa = L.map('mapa').setView([lat, lng ], 16);
    let marker;
    
    //Utilizar Provider y Geocoder
    const geocodeService = L.esri.Geocoding.geocodeService();

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);


    // el pin
    marker = new L.marker([lat, lng],{
        draggable: true, //mover el pin
        autoPan: true //mover el mapa
    })
    .addTo(mapa)

    //detectar el movimiento del ping

    marker.on('moveend', function (e) {
        marker = e.target

        const posicion = marker.getLatLng();

        mapa.panTo(new L.LatLng(posicion.lat, posicion.lng))

        //Obtener la informacion de la calle al soltar el pin

        geocodeService.reverse().latlng(posicion, 13).run(function(err, res) {
            // console.log(res);
            
            marker.bindPopup(res.address.LongLabel)

            // llenar los campos

            document.querySelector('.calle').textContent = res?.address?.Address ?? '';
            document.querySelector('#calle').value = res?.address?.Address ?? '';
            document.querySelector('#lat').value = res?.latlng?.lat ?? '';
            document.querySelector('#lng').value = res?.latlng?.lng ?? '';
        })
    })

})()