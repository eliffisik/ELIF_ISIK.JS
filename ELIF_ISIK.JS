(function () {
  const LOCAL_STORAGE_KEY = "carousel_products";
  const FAVORITES_KEY = "favorite_product_ids";
  if (location.pathname !== "/") {
    console.log("wrong page");
    return;
  }

  async function loadProducts() {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) return JSON.parse(cached);
    const res = await fetch(
      "https://gist.githubusercontent.com/sevindi/8bcbde9f02c1d4abe112809c974e1f49/raw/9bf93b58df623a9b16f1db721cd0a7a539296cf0/products.json"
    );
    const data = await res.json();
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    return data;
  }


function getFavorites() {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
  }

  function toggleFavorite(id) {
    const favs = getFavorites();
    const i = favs.indexOf(id);
    i === -1 ? favs.push(id) : favs.splice(i, 1);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
    return favs;
  }


})();
