const express = require('express');
const app = express();
const port = 3000; // Porta em que o servidor irá rodar

// Rota para fornecer os dados dos produtos
app.get('/api/produtos', (req, res) => {
    // Aqui você faria a consulta ao banco de dados para obter os produtos
    // Suponha que você tenha uma função ou um módulo para isso

    // Por enquanto, vamos simular que os produtos são obtidos do banco de dados
    const produtos = [
        { nome: 'Produto 1', quantidade: 10, codigoBarras: '123456789', categoria: 'Categoria 1' },
        { nome: 'Produto 2', quantidade: 20, codigoBarras: '987654321', categoria: 'Categoria 2' }
        // Adicione mais produtos conforme necessário
    ];

    // Envie os produtos como resposta
    res.json(produtos);
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
