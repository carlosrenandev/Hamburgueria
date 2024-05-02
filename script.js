const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const modal = document.getElementById("cart-modal");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartCounter = document.getElementById("cart-count");
const nameInput = document.getElementById("name-input");
const inputCep = document.getElementById("inputCep");
const inputRua = document.getElementById("inputRua");
const inputBairro = document.getElementById("inputBairro");
const inputCidade = document.getElementById("inputCidade")
const inputNumero = document.getElementById("inputNumero");
const checkoutBtn = document.getElementById("checkout-btn");

let cart = [];

//ABRIR MODAL AO CLICAR NO CARRINHO
cartBtn.addEventListener("click", () => {
  updateCartModal();
  modal.style.display = "flex";
});

//FECHAR MODAL AO CLICAR NO BOTÃO FECHAR
closeModalBtn.addEventListener("click", () => {
  modal.style.display = "none";
  updateCartModal();
});

//FECHAR MODAL AO CLICAR FORA
modal.addEventListener("click", function (event) {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});

// QUANDO EU CLICAR NO CARRINHO
menu.addEventListener("click", function (event) {
  let parentButton = event.target.closest(".add-to-cart-btn");

  if (parentButton) {
    const name = parentButton.getAttribute("data-name");
    const price = parseFloat(parentButton.getAttribute("data-price"));

    //Adicionar no carrinho
    addToCart(name, price);

    if (cart.length >= 3) {
      cartItemsContainer.style.overflow = "auto";
      cartItemsContainer.style.maxHeight = "150px";
    }
  }
});

//FUNCAO PARA BUSCAR O DADOS DO CEP
function buscarCep() {
  var url = "https://viacep.com.br/ws/" + inputCep.value + "/json/";

  if (inputCep.value !== "") {
    fetch(url)
      .then((res) => {
        if (res.ok) {
          res.json()
            .then((data) => {
              inputRua.value = data.logradouro;
              inputBairro.value = data.bairro;
              inputCidade.value = data.localidade;
              inputRua.disabled = true;
              inputBairro.disabled = true;
              inputCidade.disabled = true;
            })
        }
      })
      .catch((error) => {
        Toastify({
          text: "CEP Inválido!",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "right",
          stopOnFocus: true,
          style: {
            background: "#ef4444",
          },
        }).showToast();
        inputRua.value = "";
        inputBairro.value = "";
        inputCidade.value = "";
        inputRua.disabled = false;
        inputBairro.disabled = false;
        inputCidade.disabled = false;
      })
  } else {
    inputRua.value = "";
    inputBairro.value = "";
    inputCidade.value = "";
    inputRua.disabled = false;
    inputBairro.disabled = false;
    inputCidade.disabled = false;
  }
}
inputCep.addEventListener("blur", buscarCep);

//Função para adicionar no carrinho
function addToCart(name, price) {
  const existingItem = cart.find((item) => item.name === name); // verifica se já exsite o item que o usuario clicou

  if (existingItem) {
    existingItem.quantity += 1; // se exisitir ele vai adicionar +1 ao valor
    return;
  } else {
    cart.push({
      name,
      price,
      quantity: 1,
    });
  }

  updateCartModal();
}

//Atualizar carrinho
function updateCartModal() {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add(
      "flex",
      "justify-between",
      "mb-4",
      "flex-col"
    );

    cartItemElement.innerHTML = `
    <div class="flex items-center justify-between">
        <div>
        <p class="font-bold">${item.name}</p>
        <p>Qtd: ${item.quantity}</p>
        <p class="font-medium mt-2" >R$ ${item.price.toFixed(2)}</p>
        </div>

        
        <button class="remove-btn" data-name="${item.name}">Remover</button>
    
    </div>
        `;

    total += item.price * item.quantity;

    cartItemsContainer.appendChild(cartItemElement);
  });

  cartTotal.textContent = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  cartCounter.innerText = cart.length;
}

//Função para remover item do carrinho
cartItemsContainer.addEventListener("click", (event) => {
  if (event.target.classList.contains("remove-btn")) {
    const name = event.target.getAttribute("data-name");

    removeCartItem(name);
  }
});

function removeCartItem(name) {
  const index = cart.findIndex((item) => item.name === name);

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

checkoutBtn.addEventListener("click", () => {
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
    Toastify({
      text: "Por favor, preencha todos os campos!",
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

  if (inputRua.value === "") {
    Toastify({
      text: "Por favor, preencha todos os campos!",
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

  if (inputBairro.value === "") {
    Toastify({
      text: "Por favor, preencha todos os campos!",
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

  if (inputCidade.value === "") {
    Toastify({
      text: "Por favor, preencha todos os campos!",
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

  if (inputNumero.value === "") {
    Toastify({
      text: "Por favor, preencha todos os campos!",
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

  //ENVIAR PEDIDO PARA WHATSAPP
  const cartItems = cart
    .map((item) => {
      return `${item.name}\nQuantidade: (${item.quantity})\n\n`;
    })
    .join("");

  function totalPedido() {
    let total = 0;
    cart.forEach((element) => {
      total += element.price * element.quantity;
    });
    return total;
  }
  let total = totalPedido();
  const message = encodeURIComponent(cartItems);
  const phone = "+5587981772959";

  window.open(
    `https://wa.me/${phone}?text=${message}Nome do cliente: ${nameInput.value
    }%0AEndereço: Rua: ${inputRua.value} | Bairro: ${inputBairro.value} ${inputCidade.value} | Numero: ${inputNumero.value}%0A%0AValor total do pedido: R$ ${total.toFixed(2)}`,
    "_blank"
  );

  cart = [];
  nameInput.value = "";
  inputCep.value = "";
  inputRua.value = "";
  inputBairro.value = "";
  inputCidade.value = "";
  inputNumero.value = "";
  inputRua.disabled = false;
  inputBairro.disabled = false;
  inputCidade.disabled = false;
  modal.style.display = "none";
  updateCartModal();
  buscarCep();
});