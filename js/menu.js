(function(){

    const menuBtn = document.querySelector(".btn__menu__container");
    const list_container = document.querySelector(".lists-container");
    const tasks_container = document.querySelector(".tasks-container");

    menuBtn.addEventListener("click", () => {
        list_container.classList.toggle("active");
        tasks_container.classList.toggle("active");
    });

})();