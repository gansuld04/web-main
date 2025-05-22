export class AppComponent extends HTMLElement {
  constructor() {
    super();
    this.routes = [
      {
        path: "/",
        component: "home-page",
      },
      {
        path: "login",
        component: "login-page"
      },
      {
        path: "/item/:id",
        component: "item-page"
      },
      {
        path: "cart",
        component: "cart-page"
      },
      {
        path: "register",
        component: "register-page"
      },
      {
        path: "item-list",
        component: "item-list"
      }
    ];
  }

  connectedCallback() {
    this.innerHTML = `
      <div id="content"></div>
    `;
    
    this.contentElement = this.querySelector('#content');
    this.routerComponent = document.createElement('router-component');
    this.routerComponent.routes = this.routes;
    this.routerComponent.container = this.contentElement;
    this.appendChild(this.routerComponent);
  }
}

customElements.define('app-component', AppComponent);