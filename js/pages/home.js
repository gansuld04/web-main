import { fetchSneakers } from "../utils/api.js";

export default class HomePage extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.prod = [];
    }
  
    connectedCallback() {
      this.fetchData();
    }

    async fetchData() {
      this.prod = await fetchSneakers();
      console.log(this.prod)
      this.render();
    }
  
    render() {
      let recProds = ""
      let newProds = ""
      let mostProds = ""


      for(let prod of this.prod) {
        if (prod.type == "recommended")
          recProds += `<product-card id="${prod.id}" name="${prod.name}" price="${prod.price}" img="${prod.image}"></product-card>`
        else if (prod.type == "new")
          newProds += `<product-card id="${prod.id}" name="${prod.name}" price="${prod.price}" img="${prod.image}"></product-card>`
        else if (prod.type == "mostsold")
          mostProds += `<product-card id="${prod.id}" name="${prod.name}" price="${prod.price}" img="${prod.image}"></product-card>`
      }
      this.shadowRoot.innerHTML = `
    <link rel="stylesheet" href="css/style.css">
    <header class="nike-header">
        <video autoplay loop muted playsinline class="nike-video">
            <source src="video/header video.mp4" type="video/mp4">
            Таны браузер видеог дэмжихгүй байна.
        </video>
        <div class="nike-overlay">
            <h2>Just Do It.</h2>
        </div>
    </header>

    <main>
        <section class="product-section">
            <h2>Санал болгож буй бүтээгдэхүүн</h2>
            <div class="product-grid" id="recommended">
            ${recProds}
            </div>
          </section>

        <section class="product-section">
            <h2>Шинэ бүтээгдэхүүн</h2>
            <div class="product-grid">
              ${newProds}
            </div>
          </section>

        <section class="product-section">
            <h2>Их зарагдсан бүтээгдэхүүн</h2>
            <div class="product-grid">
              ${mostProds}
            </div>
          </section>
    </main>
      `;
    }
  }
  
  customElements.define('home-page', HomePage);
  