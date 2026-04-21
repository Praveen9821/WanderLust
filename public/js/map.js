document.addEventListener("DOMContentLoaded", () => {

    if (!coords) {
        console.error("Coordinates not found!");
        return;
    }

    const map = new maplibregl.Map({
        container: 'map',

        // 🔥 THIS IS THE KEY CHANGE
        style: "https://tiles.openfreemap.org/styles/bright",

        center: coords,
        zoom: 10
    });

    map.addControl(new maplibregl.NavigationControl());
    
    new maplibregl.Marker({ color: "red" }) // more visible marker
        .setLngLat(coords)
        .setPopup(new maplibregl.Popup({offset: 25})
        .setHTML(`<h4>${listingTitle}</h4><p>Exact location will be provided after booking</p>`))
        .addTo(map);

});