export default class ProductCard extends HTMLElement {
    static get observedAttributes() {
        return ['id', 'img', 'name', 'price'];
    }
    
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }
  
    connectedCallback() {
      this.render();
    }

    attributeChangedCallback(name, oldValue, newValue) {
      console.log(`Attribute ${name} changed from ${oldValue} to ${newValue}`);
      this.render();
    }

    render() {
      this.shadowRoot.innerHTML = `
        <link rel="stylesheet" href="css/style.css">
       <div class="product-card">
            <router-link to="/item/${this.getAttribute("id")}">
                <img src="${this.getAttribute("img")}" alt="">
                <h3>${this.getAttribute("name")}</h3>
                <p>₮${this.getAttribute("price")}</p>
            </router-link>
        </div>`;
    }
  }
  
  customElements.define('product-card', ProductCard);