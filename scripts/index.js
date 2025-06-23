// the main script

(() => {
    const finish_loading = () => {
        const loading_screen = document.getElementById("loading");
        const pixomato_app = document.getElementById("pixomato");
        console.log("pixomato has loaded");

        pixomato_app.style.display = "block";
        // loading_screen.style.opacity = 0;
        loading_screen.style.display = "none";

        // setTimeout(() => {loading_screen.style.display = "none"}, 500)
    }

    window.addEventListener("load", () => {
        // setTimeout(finish_loading, 500);
        finish_loading();
    });
});