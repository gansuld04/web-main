export default class Cart extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }
  
    connectedCallback() {
      this.render();
    }
  
    render() {
      this.shadowRoot.innerHTML = `
        <main>
            <h2>Таны сагсалсан бараа</h2>
            <div class="cart-container">
                <div class="cart-item">
                    <img src="img/nike-air-max.jpg" alt="Nike Air Max" />
                    <div class="item-details">
                    <h3>Nike Air Max</h3>
                    <p>₮250,000</p>
                    <p>Хэмжээ: 41</p>
                    <button class="remove-item">Устгах</button>
                </div>
            </div>
        </main>
      `;
    }
  }
  
  customElements.define('cart-page', Cart);
  