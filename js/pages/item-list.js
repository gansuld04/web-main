import { fetchSneakers } from "../utils/api.js";

export default class ItemList extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.prod = [];
    }

    async connectedCallback() {
        await this.fetchData(); 
        this.render();
    }

    async fetchData() {
        try {
            const res = await fetchSneakers();
            this.prod = res;

            if (this.query && this.query.brand) {
                this.prod = this.prod.filter(el => el.brand.toLowerCase() == this.query.brand.toLowerCase());
            }
            if (this.query && this.query.usage) {
                this.prod = this.prod.filter(el => el.usage.toLowerCase() === this.query.usage.toLowerCase())
            }
        } catch (error) {
            console.error("Алдаа гарлаа:", error);
            this.prod = []; 
        }
    }

    render() {
        console.log(this.prod);
        this.shadowRoot.innerHTML = `
            <style>
                .list {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 1rem;
                }
            </style>
            <div class="list">
                ${this.prod.map((item) => `
                    <product-card 
                        id="${item.id}" 
                        name="${item.name}" 
                        price="${item.price}" 
                        img="${item.image}"
                    ></product-card>
                `).join('')}
            </div>
        `;
    }
}

customElements.define('item-list', ItemList);
