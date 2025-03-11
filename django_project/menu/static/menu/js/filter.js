document.addEventListener("DOMContentLoaded", function () {
    let categoryFilter = document.getElementById("categoryFilter");
    let searchInput = document.getElementById("searchInput");

    function filterMenu() {
        let category = categoryFilter.value;
        let searchText = searchInput.value.toLowerCase();

        document.querySelectorAll(".menu-item").forEach(item => {
            let itemCategory = item.getAttribute("data-category");
            let itemName = item.querySelector(".card-title").innerText.toLowerCase();

            let categoryMatch = category === "all" || itemCategory === category;
            let nameMatch = itemName.includes(searchText);

            item.style.display = categoryMatch && nameMatch ? "block" : "none";
        });
    }

    categoryFilter.addEventListener("change", filterMenu);
    searchInput.addEventListener("input", filterMenu);
});
