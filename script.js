const menu = document.getElementById('menu');
const cartBtn = document.getElementById('cart-btn');
const modal = document.getElementById('cart-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const nameInput = document.getElementById("name-input");
const checkoutBtn = document.getElementById("checkout-btn");
const alertAddress = document.getElementById("address-warn");
const alertName = document.getElementById("name-warn");


let cart = [];

//ABRIR MODAL AO CLICAR NO CARRINHO
cartBtn.addEventListener('click', () => {
    updateCartModal();
    modal.style.display = "flex";
});

//FECHAR MODAL AO CLICAR NO BOTÃO FECHAR
closeModalBtn.addEventListener('click', () => {
    modal.style.display = "none";
    addressInput.value = "";
    nameInput.value = "";
})

//FECHAR MODAL AO CLICAR FORA
modal.addEventListener('click', function (event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
})


// QUANDO EU CLICAR NO CARRINHO
menu.addEventListener('click', function (event) {
    let parentButton = event.target.closest(".add-to-cart-btn");

    if (parentButton) {
        const name = parentButton.getAttribute("data-name");
        const price = parseFloat(parentButton.getAttribute("data-price"));

        //Adicionar no carrinho
        addToCart(name, price);

        if (cart.length > 4) {
            cartItemsContainer.style.overflow = "auto";
            cartItemsContainer.style.maxHeight = "400px"
        }
    }
})


//Função para adicionar no carrinho
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name); // verifica se já exsite o item que o usuario clicou

    if (existingItem) {
        existingItem.quantity += 1; // se exisitir ele vai adicionar +1 ao valor
        return;
    } else {
        cart.push({
            name,
            price,
            quantity: 1,
        })
    }

    updateCartModal();

}



//Atualizar carrinho
function updateCartModal() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemElement.innerHTML = `
    <div class="flex items-center justify-between">
        <div>
        <p class="font-bold">${item.name}</p>
        <p>Qtd: ${item.quantity}</p>
        <p class="font-medium mt-2" >R$ ${item.price.toFixed(2)}</p>
        </div>

        
        <button class="remove-btn" data-name="${item.name}">Remover</button>
    
    </div>
        `

        total += item.price * item.quantity;

        cartItemsContainer.appendChild(cartItemElement);
    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    cartCounter.innerText = cart.length;
}



//Função para remover item do carrinho
cartItemsContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains("remove-btn")) {
        const name = event.target.getAttribute("data-name");

        removeCartItem(name);
    }
})



function removeCartItem(name) {
    const index = cart.findIndex(item => item.name === name);

    if (index !== -1) {
        const item = cart[index];

        if (item.quantity > 1) {
            item.quantity -= 1;
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal();
    }
}


nameInput.addEventListener("input", (event) => {
    let inputValue = event.target.value;

    if (inputValue !== "") {
        nameInput.classList.remove("border-red-500");
        alertName.classList.add("hidden");
    }
})


addressInput.addEventListener("input", (event) => {
    let inputValue = event.target.value;

    if (inputValue !== "") {
        addressInput.classList.remove("border-red-500");
        alertAddress.classList.add("hidden");
    }
})



checkoutBtn.addEventListener('click', () => {

    /*const isOpen = checkHours();
    if (!isOpen) {
        Toastify({
            text: "Ops o restaurante está fechado!",
            duration: 3000,
            close: true,
            gravity: "top", 
            position: "right", 
            stopOnFocus: true, 
            style: {
                background: "#ef4444",
            },
        }).showToast();
        return;
    }*/

    if (cart.length === 0) {
        Toastify({
            text: "Por favor, adicione itens no carrinho!",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
                background: "#ef4444",
            },
        }).showToast();
        return;
    }

    if (nameInput.value === "") {
        alertName.classList.remove("hidden");
        nameInput.classList.add("border-red-500");
        return;
    }

    if (addressInput.value === "") {
        alertAddress.classList.remove("hidden");
        addressInput.classList.add("border-red-500");
        return;
    }


    //ENVIAR PEDIDO PARA WHATSAPP
    const cartItems = cart.map((item) => {
        return (
            `${item.name}\nQuantidade: (${item.quantity})\n\n`
        )
    }).join("")

    function totalPedido() {
        let total = 0;
        cart.forEach(element => {
            total += element.price * element.quantity;
        });
        return total;
    }
    let total = totalPedido();
    const message = encodeURIComponent(cartItems);
    const phone = "+5587981772959";

    window.open(`https://wa.me/${phone}?text=${message}Nome do cliente: ${nameInput.value}%0AEndereço: ${addressInput.value}%0AValor total do pedido: R$ ${total.toFixed(2)}`, "_blank");

    cart = [];
    addressInput.value = "";
    nameInput.value = "";
    modal.style.display = "none";
    updateCartModal();
})



function checkHours() {
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 22; //true = restaurante aberto;
}


const spanItem = document.getElementById("date-span");
const isOpen = checkHours();

if (isOpen) {
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-700");
} else {
    spanItem.classList.add("bg-red-500");
    spanItem.classList.remove("bg-green-700");
}