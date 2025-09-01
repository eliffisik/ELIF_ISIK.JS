(function(){
    const LOCAL_STORAGE_KEY = "carousel_products";
if(location.pathname !=="/"){
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

})();
