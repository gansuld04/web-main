export default class Login extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.prod = {};
    }

    connectedCallback() {
        this.fetchData();
        this.render();
    }

    async fetchData() {
        const res = await fetch("../../data/sneaker.json")
        const pros = await res.json();
        for(let prod of pros) {
            if (prod.id === +this.params.id) {
                this.prod = prod;
                break;
            }
        }
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
        <style>
            * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: #333;
    color: #f4f4f4;
}

a {
    text-decoration: none;
    color: inherit;
}


.logo {
    font-size: 1.5rem;
    font-weight: bold;
    display: flex;
    align-items: center;
}

.primary-text {
    color: green;
}

#container {
    margin: 50px auto;
    max-width: 400px;
    padding: 20px;
  }

  .form-wrap {
    background: #f4f4f4;
    color: #333;
    padding: 15px;
  }

  .form-wrap h2,
  .form-wrap p {
    text-align: center;
  }

  .form-wrap .form-group {
    margin-top: 15px;
  }

  .form-wrap .form-group label {
    display: block;
  }

  .form-wrap .form-group input {
    width: 100%;
    padding: 10px;
    border: #ddd 1px solid;
    border-radius: 5px;
  }

  .form-wrap button {
    display: block;
    width: 100%;
    background: green;
    padding: 10px;
    margin-top: 20px;
    color: #fff;
    cursor: pointer;
  }

  .form-wrap button:hover {
    background: blue;
  }

  .form-wrap .bottom-text {
    font-size: 13px;
    margin-top: 20px;
  }

  .footer {
    text-align: center;
    margin-top: 10px;
  }

  .footer a {
    color: green;
  }
        </style>
        <body>
    <div id="container">
      <div class="form-wrap">
        <h2>Нэвтрэх</h2>
        <form>
          <div class="form-group">
            <label for="email">Таны и-мэйл</label>
            <input type="email" name="email" id="email" />
          </div>
          <div class="form-group">
            <label for="password">Нууц үгээ бичнэ үү</label>
            <input type="password" name="password" id="password" />
          </div>
          <button type="submit" class="btn">Нэвтрэх</button>
        </form>
      </div>
      <footer>
        <p>Бүртгэлгүй бол<router-link to="register">ЭНД</router-link>дарж бүртгүүлнэ үү</p>
      </footer>
    </div>
  </body>
        `
    }
}

customElements.define('login-page', Login);
