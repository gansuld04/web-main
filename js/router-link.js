export class RouterLink extends HTMLElement {
    constructor() {
      super();
      this._handleClick = this._handleClick.bind(this);
    }
  
    connectedCallback() {
      this.attachShadow({ mode: 'open' });
      
      this.shadowRoot.innerHTML = `
        <link rel="stylesheet" href="css/style.css">
        <a part="link"><slot></slot></a>

      `;
  
      this._link = this.shadowRoot.querySelector('a');
      
      const to = this.getAttribute('to');
      if (to) {
        this._link.setAttribute('href', to);
      }
      
      this._link.addEventListener('click', this._handleClick);
      
      this._checkActive();
      
      window.addEventListener('route-changed', () => this._checkActive());
    }
    
    disconnectedCallback() {
      this._link.removeEventListener('click', this._handleClick);
      window.removeEventListener('route-changed', () => this._checkActive());
    }
    
    static get observedAttributes() {
      return ['to', 'active-exact'];
    }
    
    attributeChangedCallback(name, oldValue, newValue) {
      if (name === 'to' && this._link) {
        this._link.setAttribute('href', newValue);
        this._checkActive();
      }
      
      if (name === 'active-exact') {
        this._checkActive();
      }
    }
    
    _handleClick(event) {
      event.preventDefault();
      
      const to = this.getAttribute('to');
      if (to) {
        window.dispatchEvent(new CustomEvent('router-navigate', {
          detail: { path: to }
        }));
      }
    }
    
    _checkActive() {
      const currentPath = window.location.pathname;
      const linkPath = this.getAttribute('to');
      const exactMatch = this.hasAttribute('active-exact');
      
      if (exactMatch) {
        if (currentPath === linkPath) {
          this.classList.add('active');
        } else {
          this.classList.remove('active');
        }
      } else {
        if (currentPath === linkPath || 
            (linkPath !== '/' && currentPath.startsWith(linkPath))) {
          this.classList.add('active');
        } else {
          this.classList.remove('active');
        }
      }
    }
  }
  
  customElements.define('router-link', RouterLink);