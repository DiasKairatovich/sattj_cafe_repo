document.addEventListener("DOMContentLoaded", function () {
    let categoryFilter = document.getElementById("categoryFilter");
    let searchInput = document.getElementById("searchInput");

    function filterMenu() {
        let category = categoryFilter.value;
        let searchText = searchInput.value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        document.querySelectorAll(".menu-item").forEach(item => {
            let itemCategory = item.getAttribute("data-category");
            let itemName = item.querySelector(".card-title").innerText.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

            let categoryMatch = category === "all" || itemCategory === category;
            let nameMatch = itemName.includes(searchText);

            if (categoryMatch && nameMatch) {
                item.classList.remove("d-none");
            } else {
                item.classList.add("d-none");
            }
        });
    }

    categoryFilter.addEventListener("change", filterMenu);

    let debounceTimer;
    searchInput.addEventListener("input", function () {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(filterMenu, 300);
    });
});
