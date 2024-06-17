document.querySelector("#buscar-produtos").addEventListener("click", function () {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://api-produtos.herokuapp.com/produtos");

    xhr.addEventListener("load", function () {
        var erroAjax = document.querySelector("#erro-ajax");
        if (xhr.status == 200) {
            erroAjax.classList.add("invisivel");
            var resposta = xhr.responseText;
            var produtos = JSON.parse(resposta);
            produtos.forEach(function (produto) {
                adicionaProdutoNaTabela(produto);
            });
        } else {
            erroAjax.classList.remove("invisivel");
        }
    });

    xhr.send();
});

document.querySelector("#adicionar-produto").addEventListener("click", function (event) {
    event.preventDefault();
    var form = document.querySelector("#form-adiciona");
    var produto = obtemProdutoDoFormulario(form);
    var erros = validaProduto(produto);

    if (erros.length > 0) {
        exibeMensagensDeErro(erros);
        return;
    }

    adicionaProdutoNaTabela(produto);
    form.reset();
    document.querySelector("#mensagens-erro").innerHTML = "";
});

document.querySelector("#salvar-produtos").addEventListener("click", function () {
    var produtos = obtemProdutosDaTabela();

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:3000/produtos", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            alert("Produtos salvos com sucesso!");
        } else if (xhr.readyState === 4) {
            alert("Erro ao salvar produtos!");
        }
    };
    xhr.send(JSON.stringify(produtos));
});

function obtemProdutosDaTabela() {
    var produtos = [];
    var linhas = document.querySelectorAll("#tabela-produtos tr");

    linhas.forEach(function (linha) {
        if (linha.querySelector(".info-nome")) {
            var produto = {
                nome: linha.querySelector(".info-nome").textContent,
                quantidade: linha.querySelector(".info-quantidade").textContent,
                codigo: linha.querySelector(".info-codigo").textContent,
                categoria: linha.querySelector(".info-categoria").textContent,
                dataEntrada: linha.querySelector(".info-data-entrada").textContent
            };
            produtos.push(produto);
        }
    });

    return produtos;

}


function obtemProdutoDoFormulario(form) {
    return {
        nome: form.nome.value,
        quantidade: form.quantidade.value,
        codigo: form.codigo.value,
        categoria: form.categoria.value,
        dataEntrada: form.dataEntrada.value
    };
}

function montaTr(produto) {
    var produtoTr = document.createElement("tr");
    produtoTr.classList.add("produto");

    produtoTr.appendChild(montaTd(produto.nome, "info-nome"));
    produtoTr.appendChild(montaTd(produto.quantidade, "info-quantidade"));
    produtoTr.appendChild(montaTd(produto.codigo, "info-codigo"));
    produtoTr.appendChild(montaTd(produto.categoria, "info-categoria"));
    produtoTr.appendChild(montaTd(produto.dataEntrada, "info-data-entrada"));

    return produtoTr;
}

function montaTd(dado, classe) {
    var td = document.createElement("td");
    td.classList.add(classe);
    td.textContent = dado;
    return td;
}

function validaProduto(produto) {
    var erros = [];

    if (produto.nome.length == 0) erros.push("O nome não pode ser em branco");
    if (produto.quantidade.length == 0 || isNaN(produto.quantidade)) erros.push("Quantidade inválida");
    if (produto.codigo.length == 0) erros.push("O código de barras não pode ser em branco");
    if (produto.categoria !== "doação" && produto.categoria !== "compra") erros.push("Categoria inválida");
    if (!produto.dataEntrada) erros.push("A data de entrada não pode ser em branco");

    return erros;
}


function exibeMensagensDeErro(erros) {
    var ul = document.querySelector("#mensagens-erro");
    ul.innerHTML = "";
    erros.forEach(function (erro) {
        var li = document.createElement("li");
        li.textContent = erro;
        ul.appendChild(li);
    });
}

function adicionaProdutoNaTabela(produto) {
    var produtoTr = montaTr(produto);
    var tabela = document.querySelector("#tabela-produtos");
    tabela.appendChild(produtoTr);
}

document.querySelector("#tabela-produtos").addEventListener("dblclick", function (event) {
    event.target.parentNode.classList.add("fadeOut");
    setTimeout(function () {
        event.target.parentNode.remove();
    }, 500);
});

document.querySelector("#filtrar-tabela").addEventListener("input", function () {
    var produtos = document.querySelectorAll(".produto");
    if (this.value.length > 0) {
        produtos.forEach(function (produto) {
            var tdNome = produto.querySelector(".info-nome");
            var nome = tdNome.textContent;
            var expressao = new RegExp(this.value, "i");
            if (!expressao.test(nome)) {
                produto.classList.add("invisivel");
            } else {
                produto.classList.remove("invisivel");
            }
        }, this);
    } else {
        produtos.forEach(function (produto) {
            produto.classList.remove("invisivel");
        });
    }
});
