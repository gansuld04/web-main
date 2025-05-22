export class Router {
  constructor(routes = [], rootElement = document.body, options = {}) {
    this.routes = routes;
    this.rootElement = rootElement;
    this.currentComponent = null;
    this.options = {
      basePath: '',
      autoInitialize: true,
      notFoundPath: '/not-found',
      ...options
    };
    
    this._processRoutes();
    
    this.navigate = this.navigate.bind(this);
    this.handlePopState = this.handlePopState.bind(this);
    this.handleLinkClick = this.handleLinkClick.bind(this);
    this.handleRouterNavigate = this.handleRouterNavigate.bind(this);
    
    if (this.options.autoInitialize) {
      this.init();
    }
  }
  
 
  _processRoutes() {
    this.routes = this.routes.map(route => {
      if (route.path instanceof RegExp || !route.path.includes(':')) {
        return route;
      }
      
      const paramNames = [];
      const regexPattern = route.path.replace(/:([^\/]+)/g, (match, paramName) => {
        paramNames.push(paramName);
        return '([^/]+)';
      });
      return {
        ...route,
        originalPath: route.path,
        path: new RegExp(`^${regexPattern}$`),
        paramNames
      };
    });
  }
  
 
  init() {
    if (!document.querySelector('base')) {
      const baseEl = document.createElement('base');
      baseEl.href = window.location.origin + this.options.basePath;
      document.head.prepend(baseEl);
    }
    
    window.addEventListener('popstate', this.handlePopState);
    document.addEventListener('click', this.handleLinkClick);
    window.addEventListener('router-navigate', this.handleRouterNavigate);
    
    this.handlePopState();
  }
  
  destroy() {
    window.removeEventListener('popstate', this.handlePopState);
    document.removeEventListener('click', this.handleLinkClick);
    window.removeEventListener('router-navigate', this.handleRouterNavigate);
  }
  
  handleRouterNavigate(event) {
    if (event.detail && event.detail.path) {
      this.navigate(event.detail.path, event.detail.options);
    }
  }
  
  handleLinkClick(e) {
    let element = e.target;
    while (element && element.tagName !== 'A') {
      element = element.parentElement;
    }
    
    if (element && element.tagName === 'A') {
      const href = element.getAttribute('href');
      
      if (href && 
          href.startsWith('/') && 
          !href.startsWith('//') && 
          !element.getAttribute('target') && 
          !element.getAttribute('download') &&
          !element.hasAttribute('data-external')) {
        
        e.preventDefault(); 
        
        const options = {};
        if (element.hasAttribute('data-replace-state')) {
          options.replaceState = element.getAttribute('data-replace-state') === 'true';
        }
        
        this.navigate(href, options);
      }
    }
  }
  
  handlePopState() {
    const path = window.location.pathname.replace(this.options.basePath, '');
    const queryString = window.location.search;
    this.loadRoute(path, queryString);
  }
  
  navigate(path) {
    let [pathPart, queryPart] = path.split('?');
    const queryString = queryPart ? `?${queryPart}` : '';

    window.history.pushState(null, '', path);

    
    this.loadRoute(pathPart, queryString);
  }
  
  parseQueryParams(queryString) {
    if (!queryString || queryString === '?') return {};
    
    const params = {};
    const searchParams = new URLSearchParams(queryString);
    
    searchParams.forEach((value, key) => {
      if (key.endsWith('[]')) {
        const arrayKey = key.slice(0, -2);
        if (!params[arrayKey]) {
          params[arrayKey] = [];
        }
        params[arrayKey].push(value);
      } else {
        if (params[key] && Array.isArray(params[key])) {
          params[key].push(value);
        } 
        else if (params[key]) {
          params[key] = [params[key], value];
        } 
        else {
          params[key] = value;
        }
      }
    });
    
    return params;
  }
  
  loadRoute(path, queryString = '') {
    let matchedRoute = null;
    let routeParams = {};
    
    for (const route of this.routes) {
      if (typeof route.path === 'string') {
        if (route.path === path) {
          matchedRoute = route;
          break;
        }
      } else if (route.path instanceof RegExp) {
        const matches = path.match(route.path);
        if (matches) {
          matchedRoute = route;
          
          if (route.paramNames) {
            route.paramNames.forEach((name, index) => {
              routeParams[name] = matches[index + 1];
            });
          } else {
            routeParams = matches.slice(1);
          }
          break;
        }
      }
    }
    
    const queryParams = this.parseQueryParams(queryString);
    
    if (matchedRoute) {
      this._renderComponent(matchedRoute, {
        path,
        params: routeParams,
        query: queryParams,
        queryString
      });
    } else {
      console.warn(`No route found for: ${path}`);
      const notFoundRoute = this.routes.find(r => 
        (typeof r.path === 'string' && r.path === this.options.notFoundPath) || 
        (r.originalPath === this.options.notFoundPath)
      );
      
      if (notFoundRoute && path !== this.options.notFoundPath) {
        this.navigate(this.options.notFoundPath);
      }
    }
  }
  
  _renderComponent(route, routeData) {
    if (this.currentComponent) {
      if (typeof this.currentComponent.beforeDestroy === 'function') {
        this.currentComponent.beforeDestroy();
      }
      
      if (this.rootElement.contains(this.currentComponent)) {
        this.rootElement.removeChild(this.currentComponent);
      }
    }

    const Component = route.component;
    let componentInstance;
    
    if (typeof Component === 'function') {
      componentInstance = new Component();
    } else if (typeof Component === 'string') {
      componentInstance = document.createElement(Component);
    } else {
      console.error('Invalid component type');
      return;
    }
    
    componentInstance.params = routeData.params;
    componentInstance.query = routeData.query;
    componentInstance.queryString = routeData.queryString;
    
    if (typeof componentInstance.beforeMount === 'function') {
      componentInstance.beforeMount();
    }
    
    this.currentComponent = componentInstance;
    this.rootElement.appendChild(componentInstance);
    
    if (typeof componentInstance.afterMount === 'function') {
      componentInstance.afterMount();
    }
    
    window.dispatchEvent(new CustomEvent('route-changed', { 
      detail: { 
        path: routeData.path,
        component: componentInstance, 
        params: routeData.params,
        query: routeData.query
      } 
    }));
  }
  
  
  getCurrentRoute() {
    return {
      path: window.location.pathname.replace(this.options.basePath, ''),
      queryString: window.location.search,
      query: this.parseQueryParams(window.location.search),
      component: this.currentComponent
    };
  }
}