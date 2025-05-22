import { fetchSneakers } from "../utils/api.js";

export default class ItemPage extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.prod = {};
    }

    connectedCallback() {
        this.fetchData();
        this.render();
    }

    setupEventListener() {
      const addCartBtn = this.shadowRoot.getElementById('add-cart');
      const sizeSelect = this.shadowRoot.getElementById('size');
    
      if (addCartBtn && sizeSelect) {
        addCartBtn.addEventListener('click', () => {
          const selectedSize = sizeSelect.value;
    
          const itemToAdd = {
            ...this.prod,
            size: selectedSize,
            quantity: 1 
          };
    
          window.cartService.addItem(itemToAdd);
        });
      }
    }
    
    attributeChangedCallback(name, oldValue, newValue){
        if (oldValue === newValue) return;
        if (name === 'name') this.name = newValue;
    }

    async fetchData() {
        const res = await fetchSneakers();
        for (let prod of res) {
          if (prod.id === + this.params.id) {
            this.prod = prod;
            break;
          }
        }
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
        <link rel="stylesheet" href="css/style.css">
        <style>
            main {
                display: flex;
                flex-wrap: wrap;
                padding: 2rem;
                gap: 2rem;
                }

                .product-details {
            flex: 2;
            min-width: 0;
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 2rem;
            }

            .product-image {
            width: 100%;
            height: auto;
            max-height: 80vh;
            object-fit: contain;
            border-radius: 15px;
            background-color: white;
            }

                .product-info h2 {
                margin: 1rem 0 0;
                }

                .buy-section {
            flex: 1;
            background-color: #1c1c1c;
            padding: 2rem;
            border-radius: 12px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            gap: 1rem;
            max-height: 100vh;
            }

                .buy-section h2 {
                color: #7ed6a8;
                font-size: 2rem;
                }

                .buy-now {
                display: block;
                width: 100%;
                background-color: #7ed6a8;
                color: #000;
                padding: 1rem;
                border: none;
                border-radius: 10px;
                font-weight: bold;
                cursor: pointer;
                margin: 1rem 0;
                transition: background 0.3s ease;
                }

                .buy-now:hover {
                background-color: #62c097;
                }

                .size-select {
                width: 100%;
                padding: 0.7rem;
                margin: 1rem 0;
                border-radius: 8px;
                border: none;
                font-size: 1rem;
                }

                .stock-info {
                color: #aaa;
                margin-bottom: 1rem;
                }
            </style>
        <main>
        <section class="product-details">
          <img src="${this.prod.image}" alt="Nike Air Max" class="product-image" />
          <div class="product-info">
            <h2>${this.prod.name}</h2>
            <p>Lifestyle / Nike</p>
          </div>
        </section>
    
        <aside class="buy-section">
          <p>Үнэ:</p>
          <h2>₮${this.prod.price}</h2>
    
          <label for="size">Size:</label>
          <select id="size" class="size-select">
            <option value="38">38</option>
            <option value="39">39</option>
            <option value="40">40</option>
            <option value="41">41</option>
            <option value="42">42</option>
          </select>    
          <button id="add-cart" class="buy-now">Худалдаж авах</button>
        </aside>
      </main>
        `;
      this.setupEventListener();
    }
}

customElements.define('item-page', ItemPage);
