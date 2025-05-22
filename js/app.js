import { cartService } from "./cart-service.js";
import "./pages/home.js";
import "./pages/item.js";
import "./components/product-card.js";
import "./components/navbar.js";
import "./router-link.js";
import "./components/app-component.js";
import "./components/router-component.js";
import "./pages/login.js";
import "./pages/register.js";
import "./pages/cart.js";
import "./pages/item-list.js";

window.cartService = cartService;

const appDiv = document.getElementById("app");
const appComponent = document.createElement("app-component");
appDiv.appendChild(appComponent);