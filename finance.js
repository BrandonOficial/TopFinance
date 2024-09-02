// Script do sistema financeiro
document.addEventListener("DOMContentLoaded", () => {
  const tbody = document.querySelector("tbody");
  const descItem = document.querySelector("#desc");
  const amount = document.querySelector("#amount");
  const type = document.querySelector("#type");
  const btnNew = document.querySelector("#btnNew");

  const incomes = document.querySelector(".incomes");
  const expenses = document.querySelector(".expenses");
  const total = document.querySelector(".total");

  let items = getItensBD();

  btnNew.onclick = () => {
    const desc = descItem.value.trim();
    const amt = parseFloat(amount.value.trim());

    if (!desc || isNaN(amt) || !type.value) {
      return alert("Preencha todos os campos corretamente!");
    }

    items.push({
      desc: sanitizeHTML(desc),
      amount: amt.toFixed(2),
      type: type.value,
    });

    updateStorageAndUI();
    clearFields();
  };

  function deleteItem(index) {
    items.splice(index, 1);
    updateStorageAndUI();
  }

  function insertItem(item, index) {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${sanitizeHTML(item.desc)}</td>
      <td>R$ ${item.amount}</td>
      <td class="columnType">${
        item.type === "Entrada"
          ? '<i class="bx bxs-chevron-up-circle"></i>'
          : '<i class="bx bxs-chevron-down-circle"></i>'
      }</td>
      <td class="columnAction">
        <button class="delete-btn"><i class='bx bx-trash'></i></button>
      </td>
    `;

    tbody.appendChild(tr);

    // Adiciona o event listener para o botão de excluir
    tr.querySelector(".delete-btn").addEventListener("click", () =>
      deleteItem(index)
    );
  }

  function updateStorageAndUI() {
    setItensBD(items);
    loadItens();
  }

  function loadItens() {
    tbody.innerHTML = "";
    items.forEach((item, index) => insertItem(item, index));
    updateTotals();
  }

  function updateTotals() {
    const totalIncomes = calculateTotal("Entrada");
    const totalExpenses = calculateTotal("Saída");
    const totalItems = (totalIncomes - totalExpenses).toFixed(2);

    incomes.textContent = `R$ ${totalIncomes.toFixed(2)}`;
    expenses.textContent = `R$ ${Math.abs(totalExpenses).toFixed(2)}`;
    total.textContent = `R$ ${totalItems}`;
  }

  function calculateTotal(type) {
    return items
      .filter((item) => item.type === type)
      .reduce((sum, item) => sum + parseFloat(item.amount), 0);
  }

  function sanitizeHTML(text) {
    const element = document.createElement("div");
    element.textContent = text;
    return element.innerHTML;
  }

  function clearFields() {
    descItem.value = "";
    amount.value = "";
    type.value = "";
  }

  function getItensBD() {
    try {
      return JSON.parse(localStorage.getItem("db_items")) || [];
    } catch (e) {
      console.error("Erro ao carregar os itens do BD", e);
      return [];
    }
  }

  function setItensBD(items) {
    try {
      localStorage.setItem("db_items", JSON.stringify(items));
    } catch (e) {
      console.error("Erro ao salvar os itens no BD", e);
    }
  }

  loadItens();
});

// dark mode and sun mode

const body = document.querySelector("body"),
  sidebar = body.querySelector(".sidebar"),
  toggle = body.querySelector(".toggle"),
  searchBtn = body.querySelector(".search-box"),
  modeSwitch = body.querySelector(".toggle-switch"),
  modeText = body.querySelector(".mode-text");

toggle.addEventListener("click", () => {
  sidebar.classList.toggle("close");
});

searchBtn.addEventListener("click", () => {
  sidebar.classList.remove("close");
});

modeSwitch.addEventListener("click", () => {
  body.classList.toggle("dark");

  if(body.classList.contains("dark")) {
    modeText.innerText = "Light Mode"
  } else {
    modeText.innerText = "Dark Mode"
  }
});