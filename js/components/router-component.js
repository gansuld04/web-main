import { Router } from "../router.js";

export class RouterComponent extends HTMLElement {
  constructor() {
    super();
    this._routes = [];
    this._container = null;
    this.router = null;
  }

  set routes(routes) {
    this._routes = routes;
    this._initializeRouter();
  }

  set container(container) {
    this._container = container;
    this._initializeRouter();
  }

  _initializeRouter() {
    if (this._routes.length && this._container) {
      this.router = new Router(this._routes, this._container);
    }
  }

  navigate(path, options = {}) {
    if (this.router) {
      this.router.navigate(path, options);
    }
  }

  getCurrentRoute() {
    if (this.router) {
      return this.router.getCurrentRoute();
    }
    return null;
  }
}

customElements.define('router-component', RouterComponent);