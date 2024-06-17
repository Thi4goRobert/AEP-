const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const { format, parseISO, isValid } = require('date-fns');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configuração do pool de conexões com o banco de dados
const db = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    database: 'estoque'
});

// Verifica se há erros na conexão do pool
db.getConnection((err, connection) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados MySQL');
    connection.release(); // Libera a conexão após o uso
});

// Rota para adicionar produtos
app.post('/produtos', (req, res) => {
    const produtos = req.body;
    let errors = [];
    let processedCount = 0;

    produtos.forEach(produto => {
        const { nome, quantidade, codigo, categoria, dataEntrada } = produto;

        // Verifica se a data é válida
        const parsedDate = parseISO(dataEntrada);
        if (!isValid(parsedDate)) {
            errors.push(`Data inválida para o produto: ${nome}`);
            console.error(`Data inválida para o produto: ${nome}`);
            processedCount++;
            if (processedCount === produtos.length) {
                res.status(400).send(errors.length ? errors.join(', ') : 'Produtos processados com sucesso');
            }
            return;
        }

        const dataFormatada = format(parsedDate, 'yyyy-MM-dd');

        const verificaQuery = 'SELECT * FROM produtos WHERE codigo = ? AND categoria = ?';
        db.query(verificaQuery, [codigo, categoria], (err, results) => {
            if (err) {
                console.error('Erro ao verificar produto:', err);
                errors.push('Erro ao verificar produto');
                processedCount++;
                if (processedCount === produtos.length) {
                    res.status(500).send(errors.length ? errors.join(', ') : 'Produtos processados com sucesso');
                }
                return;
            }

            if (results.length > 0) {
                const atualizaQuery = 'UPDATE produtos SET quantidade = quantidade + ? WHERE codigo = ? AND categoria = ?';
                db.query(atualizaQuery, [quantidade, codigo, categoria], (err, updateResults) => {
                    if (err) {
                        console.error('Erro ao atualizar produto:', err);
                        errors.push('Erro ao atualizar produto');
                        processedCount++;
                        if (processedCount === produtos.length) {
                            res.status(500).send(errors.length ? errors.join(', ') : 'Produtos processados com sucesso');
                        }
                        return;
                    }
                    console.log(`Produto atualizado: ${codigo}, ${categoria}`);
                    processedCount++;
                    if (processedCount === produtos.length) {
                        res.status(200).send(errors.length ? errors.join(', ') : 'Produtos processados com sucesso');
                    }
                });
            } else {
                const insereQuery = 'INSERT INTO produtos (nome, quantidade, codigo, categoria, dataEntrada) VALUES (?, ?, ?, ?, ?)';
                db.query(insereQuery, [nome, quantidade, codigo, categoria, dataFormatada], (err, insertResults) => {
                    if (err) {
                        console.error('Erro ao inserir produto:', err);
                        errors.push('Erro ao inserir produto');
                        processedCount++;
                        if (processedCount === produtos.length) {
                            res.status(500).send(errors.length ? errors.join(', ') : 'Produtos processados com sucesso');
                        }
                        return;
                    }
                    console.log(`Produto inserido: ${nome}`);
                    processedCount++;
                    if (processedCount === produtos.length) {
                        res.status(200).send(errors.length ? errors.join(', ') : 'Produtos processados com sucesso');
                    }
                });
            }
        });
    });
});

// Rota para buscar produtos
app.get('/produtos', (req, res) => {
    db.query('SELECT * FROM produtos', (err, results) => {
        if (err) {
            console.error('Erro ao buscar produtos:', err);
            res.status(500).send('Erro ao buscar produtos');
            return;
        }
        res.status(200).json(results);
    });
});

// Rota para registrar saída de produtos
app.post('/api/saida', (req, res) => {
    const produtos = req.body.produtos;

    produtos.forEach(produto => {
        const { id, quantidade } = produto;
        const atualizaQuery = 'UPDATE produtos SET quantidade = quantidade - ? WHERE id = ?';

        db.query(atualizaQuery, [quantidade, id], (err, updateResults) => {
            if (err) {
                console.error('Erro ao atualizar quantidade:', err);
                res.status(500).send('Erro ao atualizar quantidade');
                return;
            }
            console.log(`Quantidade atualizada para o produto ID ${id}`);
        });
    });

    res.status(200).send('Saída de produtos registrada com sucesso');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
