import { checkout } from "../utils/api.js";

export default class Cart extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.cart = [];
  }

  connectedCallback() {
    this.cart = window.cartService.getCart();
    this.render();
  }

  removeFromCart(id) {
    window.cartService.removeItem(id);
    this.cart=window.cartService.getCart()
    this.render();
  }

  getTotal() {
    return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  render() {
    const itemsHTML = this.cart.map((item, index) => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" />
        <div class="item-details">
          <h3>${item.name}</h3>
          <p>₮${item.price}</p>
          <p>Хэмжээ: ${item.size}</p>
          <button class="remove-item" data-id="${item.id}">Устгах</button>
        </div>
      </div>
    `).join('');

    const totalAmount = this.getTotal();

    this.shadowRoot.innerHTML = `
      <style>
        main {
          padding: 2rem;
        }
    
        .cart-container {
          margin: 2rem;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 1.5rem;
          justify-items: center;
        }
    
        .cart-item {
          display: flex;
          gap: 1rem;
          background-color: #030303;
          border-radius: 12px;
          padding: 1rem;
          align-items: center;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
        }
    
        .cart-item img {
          width: 100px;
          height: auto;
          border-radius: 10px;
        }
    
        .item-details {
          flex: 1;
        }
    
        .item-details h3 {
          margin: 0 0 0.3rem;
        }
    
        .remove-item {
          background-color: #e74c3c;
          color: white;
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          margin-top: 0.5rem;
          transition: background 0.3s ease;
        }
    
        .remove-item:hover {
          background-color: #c0392b;
        }
    
        .cart-summary {
          margin-top: 2rem;
          text-align: center;
        }
    
        .checkout-btn {
          background-color: #7ed6a8;
          color: #000;
          padding: 0.75rem 2rem;
          border: none;
          border-radius: 10px;
          font-weight: bold;
          cursor: pointer;
        }
    
        .checkout-btn:hover {
          background-color: #62c097;
        }
      </style>

      <main>
        <h2>Таны сагсалсан бараа</h2>
        <div class="cart-container">
          ${itemsHTML || '<p>Сагс хоосон байна.</p>'}
        </div>

        <div class="cart-summary">
          <h3>Нийт дүн: ₮${totalAmount}</h3>
          <button class="checkout-btn">Төлбөр төлөх</button>
        </div>
      </main>
    `;

    this.shadowRoot.querySelectorAll('.remove-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = +e.target.dataset.id;
        this.removeFromCart(id);
      });
    });

    const checkoutBtn = this.shadowRoot.querySelector('.checkout-btn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        checkout();
        alert("Төлбөр төлөх хэсэг рүү шилжиж байна");
      });
    }
  }
}

customElements.define('cart-page', Cart);
