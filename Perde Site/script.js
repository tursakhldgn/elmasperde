const products = [
    { id: 1, name: "Desensiz Modern Perde", img: "desensiz.jpeg", meterPrice: 200 },
    { id: 2, name: "Desenli Şık Perde", img: "desenli2.jpeg", meterPrice: 250 },
    { id: 3, name: "Modern Perde", img: "desenli3.jpeg", meterPrice: 250 },
    { id: 4, name: "Şık Perde", img: "desenli4.jpeg", meterPrice: 250 },
    { id: 5, name: "Misafir Odası Perde", img: "desenli5.jpeg", meterPrice: 300 },
    { id: 6, name: "Zebra Perde", img: "zebra.jpg", meterPrice: 400 }
];

let cart = JSON.parse(localStorage.getItem('elmasCart')) || [];

// Sepet sayısını güncelle
function updateCartCount() {
    document.querySelectorAll('#cartCount').forEach(el => {
        if (el) el.textContent = cart.length || 0;
    });
}

// Modal aç
function openModal(productId) {
    const product = products.find(p => p.id == productId);
    if (!product) return;

    document.getElementById('modalTitle').textContent = product.name;
    document.getElementById('modalImg').src = product.img;

    const widthInput = document.getElementById('width');
    const priceEl = document.getElementById('estimatedPrice');
    priceEl.textContent = '0';

    widthInput.oninput = () => {
        const w = parseFloat(widthInput.value) || 0;
        if (w >= 50) {
            const price = Math.round((w / 100) * product.meterPrice);
            priceEl.textContent = price.toLocaleString();
        } else {
            priceEl.textContent = '0';
        }
    };

    document.getElementById('addBtn').onclick = () => {
        const width = widthInput.value.trim();
        const phone = prompt("Telefon numaranızı girin:");

        if (!width || !phone) return alert("Bilgiler eksik!");
        if (parseFloat(width) < 50) return alert("Min 50 cm!");

        const price = parseInt(priceEl.textContent.replace(/\./g, '')) || 0;
        const deposit = Math.round(price * 0.5);

        cart.push({
            id: Date.now(),
            product,
            width: parseInt(width),
            phone,
            price,
            deposit
        });

        localStorage.setItem('elmasCart', JSON.stringify(cart));
        updateCartCount();
        closeModal();
        alert("Sepete eklendi!");
    };

    document.getElementById('modal').classList.add('active');
}

function closeModal() {
    document.getElementById('modal').classList.remove('active');
    document.getElementById('width').value = '';
}

// Ürün tıklama
document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', () => openModal(card.dataset.id));
});

// Sepet render – KESİN ÇALIŞACAK ŞEKİL
function renderCart() {
    const container = document.getElementById('cartItems');
    if (!container) return;

    const summary = document.getElementById('summary');
    const empty = document.getElementById('emptyCart');

    updateCartCount();

    if (cart.length === 0) {
        container.innerHTML = '';
        empty.style.display = 'block';
        summary.style.display = 'none';
        return;
    }

    empty.style.display = 'none';
    summary.style.display = 'block';

    let total = 0;
    let depositTotal = 0;

    container.innerHTML = cart.map(item => {
        total += item.price;
        depositTotal += item.deposit;
        return `
            <div class="cart-item">
                <img src="${item.product.img}" alt="${item.product.name}">
                <div class="cart-item-info">
                    <h4>${item.product.name}</h4>
                    <p>📏 Genişlik: ${item.width} cm</p>
                    <p>📱 ${item.phone}</p>
                    <p style="color:#d35400; font-weight:bold;">💰 ${item.price.toLocaleString()} TL</p>
                    <p style="color:#e67e22; font-weight:bold;">💳 Kapora: ${item.deposit.toLocaleString()} TL</p>
                    <button class="btn-danger" onclick="removeItem(${item.id})">Sil</button>
                </div>
            </div>
        `;
    }).join('');

    document.getElementById('totalCount').textContent = cart.length;
    document.getElementById('totalPrice').textContent = total.toLocaleString() + ' TL';
    document.getElementById('totalDeposit').textContent = depositTotal.toLocaleString() + ' TL';
}

function removeItem(id) {
    cart = cart.filter(item => item.id != id);
    localStorage.setItem('elmasCart', JSON.stringify(cart));
    renderCart();
}

function sendOrder() {
    if (cart.length === 0) return alert("Sepet boş!");

    let msg = "🛒 YENİ SİPARİŞ - ELMAS PERDE 🛒\n\n";
    let total = 0;
    let depositTotal = 0;

    cart.forEach(item => {
        msg += `${item.product.name}\nGenişlik: ${item.width} cm\nTelefon: ${item.phone}\nFiyat: ${item.price.toLocaleString()} TL\nKapora: ${item.deposit.toLocaleString()} TL\n\n`;
        total += item.price;
        depositTotal += item.deposit;
    });

    msg += `TOPLAM: ${total.toLocaleString()} TL\nKAPORA: ${depositTotal.toLocaleString()} TL`;

    window.open(`https://wa.me/905521875626?text=${encodeURIComponent(msg)}`, '_blank');
}

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    renderCart(); // Bu satır kritik – her sayfada çalışır
});