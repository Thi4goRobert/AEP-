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

                    const tdAcoes = document.createElement("td");
                    const btnSelecionar = document.createElement("button");
                    btnSelecionar.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/></svg>';
                    btnSelecionar.classList.add("btn", "btn-danger", "btn-sm", "btn-selecionar"); // Adiciona classe btn-sm para diminuir o tamanho
                    btnSelecionar.dataset.id = produto.id;
                    btnSelecionar.dataset.nome = produto.nome;
                    btnSelecionar.dataset.quantidade = produto.quantidade; // Adiciona o dataset quantidade
                    btnSelecionar.dataset.codigo = produto.codigo;
                    btnSelecionar.dataset.categoria = produto.categoria;
                    tdAcoes.appendChild(btnSelecionar);
                    tr.appendChild(tdAcoes);

                    tabelaProdutos.appendChild(tr);
                });

                // Limpa a lista de produtos selecionados ao buscar novos produtos
                document.getElementById("produtos-selecionados").innerHTML = "";
            })
            .catch(error => {
                console.error("Erro ao buscar produtos:", error);
                document.getElementById("erro-ajax").classList.remove("invisivel");
            });
    });

    // Evento para selecionar produto ao clicar no botão "Selecionar"
    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("btn-selecionar")) {
            const produtoId = event.target.dataset.id;
            const produtoNome = event.target.dataset.nome;
            const produtoQuantidade = event.target.dataset.quantidade; // Captura a quantidade do dataset

            const item = document.createElement("li");
            item.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
            item.textContent = `${produtoNome} - Quantidade: ${produtoQuantidade}`; // Exibe o nome e a quantidade
            item.dataset.id = produtoId;
            item.dataset.quantidade = produtoQuantidade; // Mantém a quantidade no dataset

            const produtosSelecionados = document.getElementById("produtos-selecionados");
            produtosSelecionados.appendChild(item);

            // Preenche o input de quantidade com a quantidade do produto
            document.getElementById("quantidade-saida").value = produtoQuantidade;
        }
    });

    // Evento para confirmar a saída dos produtos
    document.getElementById("form-saida").addEventListener("submit", function (event) {
        event.preventDefault();

        const dataSaida = new Date().toISOString().slice(0, 10); // Obtém a data atual no formato ISO8601

        const produtosSelecionados = [];
        document.querySelectorAll("#produtos-selecionados li").forEach(item => {
            produtosSelecionados.push({
                id: item.dataset.id,
                quantidade: item.dataset.quantidade,
                dataSaida: dataSaida  // Inclui a data de saída
            });
        });

        fetch("http://localhost:3000/api/saida", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ produtos: produtosSelecionados })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Erro ao confirmar saída de produtos");
                }
                alert("Saída de produtos confirmada com sucesso.");
                buscarProdutosBtn.click(); // Recarrega os produtos após a saída
                document.getElementById("produtos-selecionados").innerHTML = ""; // Limpa a lista de produtos selecionados
                document.getElementById("quantidade-saida").value = ""; // Limpa o campo de quantidade
            })
            .catch(error => {
                console.error("Erro ao confirmar saída de produtos:", error);
                alert("Erro ao confirmar saída de produtos.");
            });
    });

});
