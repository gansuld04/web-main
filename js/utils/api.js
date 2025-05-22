export async function fetchSneakers() {
    try {
      const response = await fetch('http://localhost:3000/sneakers');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const sneakers = await response.json();
      return sneakers;
    } catch (error) {
      console.error('Failed to fetch sneakers:', error);
      return [];
    }
  }
export async function checkout() {
  try {
    const cart = window.cartService.getCart();

    if (cart.length === 0) {
      alert("Сагс хоосон байна. Бараа нэмнэ үү!");
      return;
    }

    const response = await fetch('http://localhost:3000/orders/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ products: cart }), 
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const res = await response.json();
    if (res.success) {
      alert("Төлбөрийн мэдээлэл амжилттай илгээлээ!");
    }
  } catch (error) {
    console.error('Төлбөр төлөх үед алдаа гарлаа:', error);
  }
}