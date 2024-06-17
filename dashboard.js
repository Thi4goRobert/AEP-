document.addEventListener("DOMContentLoaded", function () {
    const buscarProdutosBtn = document.getElementById("buscar-produtos");

    buscarProdutosBtn.addEventListener("click", function () {
        fetch("http://localhost:3000/produtos")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Erro ao buscar produtos");
                }
                return response.json();
            })
            .then(produtos => {
                const tabelaProdutos = document.getElementById("tabela-produtos");
                tabelaProdutos.innerHTML = "";

                produtos.forEach(produto => {
                    const tr = document.createElement("tr");

                    const tdNome = document.createElement("td");
                    tdNome.textContent = produto.nome;
                    tr.appendChild(tdNome);

                    const tdQuantidade = document.createElement("td");
                    tdQuantidade.textContent = produto.quantidade;
                    tr.appendChild(tdQuantidade);

                    const tdCodigo = document.createElement("td");
                    tdCodigo.textContent = produto.codigo;
                    tr.appendChild(tdCodigo);

                    const tdCategoria = document.createElement("td");
                    tdCategoria.textContent = produto.categoria;
                    tr.appendChild(tdCategoria);

                    tabelaProdutos.appendChild(tr);
                });
            })
            .catch(error => {
                console.error("Erro ao buscar produtos:", error);
                document.getElementById("erro-ajax").classList.remove("invisivel");
            });
    });
});
document.querySelector("#filtrar-tabela").addEventListener("input", function () {
    var produtos = document.querySelectorAll("#tabela-produtos tr"); // Seleciona todas as linhas da tabela de produtos

    if (this.value.length > 0) {
        produtos.forEach(function (produto) {
            var tdNome = produto.querySelector("td:first-child"); // Seleciona a primeira célula (nome do produto)
            var nome = tdNome.textContent.trim(); // Obtém o texto e remove espaços em branco extras
            var expressao = new RegExp(this.value, "i"); // Expressão regular para buscar texto insensitivo a maiúsculas/minúsculas

            if (!expressao.test(nome)) {
                produto.classList.add("d-none"); // Oculta a linha se não houver correspondência
            } else {
                produto.classList.remove("d-none"); // Mostra a linha se houver correspondência
            }
        }, this);
    } else {
        produtos.forEach(function (produto) {
            produto.classList.remove("d-none"); // Mostra todas as linhas se o campo de filtro estiver vazio
        });
    }
});
