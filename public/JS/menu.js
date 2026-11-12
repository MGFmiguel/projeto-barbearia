const linkCortes = document.getElementById("linkCortes");

const frameCortes = document.getElementById("frameCortes");

const cards = document.querySelector(".cards");

const ultimos = document.querySelector(".ultimos");

const header = document.querySelector("main header");


linkCortes.addEventListener("click", function(event) {

    event.preventDefault();

    // Esconde o dashboard
    cards.style.display = "none";

    ultimos.style.display = "none";

    header.style.display = "none";

    // Mostra o iframe
    frameCortes.style.display = "block";

    // Evita recarregar se já estiver carregado
    if (!frameCortes.src.endsWith("/cortes")) {

        frameCortes.src = "/cortes";

    }

});