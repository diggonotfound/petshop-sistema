
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();

app.use(cors({
    origin: 'https://potential-space-fiesta-gx6w99g4pxpqf9g9-4200.app.github.dev',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const db = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {}
});

app.get('/', (req, res) => {
    res.send('API do Petshop funcionando!');
});

app.get('/clientes', async (req, res) => {
    try {
        const [clientes] = await db.query(
            'SELECT * FROM clientes ORDER BY id DESC'
        );

        res.json(clientes);

    } catch (erro) {
        console.error('Erro ao buscar clientes:', erro.message);
        res.status(500).json({
            mensagem: 'Erro ao buscar clientes.'
        });
    }
});

app.get('/animais', async (req, res) => {
    try {
        const [animais] = await db.query(`
            SELECT animais.*, clientes.nome AS nome_cliente
            FROM animais
            INNER JOIN clientes ON animais.cliente_id = clientes.id
            ORDER BY animais.id DESC
        `);

        res.json(animais);

    } catch (erro) {
        console.error('Erro ao buscar animais:', erro.message);
        res.status(500).json({
            mensagem: 'Erro ao buscar animais.'
        });
    }
});

app.post('/animais', async (req, res) => {
    try {
        const {
            nome,
            especie,
            raca,
            sexo,
            data_nascimento,
            cliente_id
        } = req.body;

        const [resultado] = await db.query(
            `INSERT INTO animais
            (nome, especie, raca, sexo, data_nascimento, cliente_id)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [nome, especie, raca, sexo, data_nascimento, cliente_id]
        );

        res.status(201).json({
            mensagem: 'Animal cadastrado com sucesso!',
            id: resultado.insertId
        });

    } catch (erro) {
        console.error('Erro ao cadastrar animal:', erro.message);
        res.status(500).json({
            mensagem: 'Erro ao cadastrar animal.'
        });
    }
});

app.put('/animais/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const {
            nome,
            especie,
            raca,
            sexo,
            data_nascimento,
            cliente_id
        } = req.body;

        const [resultado] = await db.query(
            `UPDATE animais
            SET nome = ?, especie = ?, raca = ?, sexo = ?,
            data_nascimento = ?, cliente_id = ?
            WHERE id = ?`,
            [nome, especie, raca, sexo, data_nascimento, cliente_id, id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensagem: 'Animal não encontrado.'
            });
        }

        res.json({
            mensagem: 'Animal atualizado com sucesso!'
        });

    } catch (erro) {
        console.error('Erro ao atualizar animal:', erro.message);
        res.status(500).json({
            mensagem: 'Erro ao atualizar animal.'
        });
    }
});

app.delete('/animais/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const [resultado] = await db.query(
            'DELETE FROM animais WHERE id = ?',
            [id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensagem: 'Animal não encontrado.'
            });
        }

        res.json({
            mensagem: 'Animal excluído com sucesso!'
        });

    } catch (erro) {
        console.error('Erro ao excluir animal:', erro.message);
        res.status(500).json({
            mensagem: 'Erro ao excluir animal.'
        });
    }
});

app.post('/clientes', async (req, res) => {
    try {
        const { nome, cpf, telefone, email } = req.body;

        const [resultado] = await db.query(
            'INSERT INTO clientes (nome, cpf, telefone, email) VALUES (?, ?, ?, ?)',
            [nome, cpf, telefone, email]
        );

        res.status(201).json({
            mensagem: 'Cliente cadastrado com sucesso!',
            id: resultado.insertId
        });

    } catch (erro) {
        console.error('Erro ao cadastrar cliente:', erro.message);
        res.status(500).json({
            mensagem: 'Erro ao cadastrar cliente.'
        });
    }
});

app.put('/clientes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, cpf, telefone, email } = req.body;

        const [resultado] = await db.query(
            'UPDATE clientes SET nome = ?, cpf = ?, telefone = ?, email = ? WHERE id = ?',
            [nome, cpf, telefone, email, id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensagem: 'Cliente não encontrado.'
            });
        }

        res.json({
            mensagem: 'Cliente atualizado com sucesso!'
        });

    } catch (erro) {
        console.error('Erro ao atualizar cliente:', erro.message);
        res.status(500).json({
            mensagem: 'Erro ao atualizar cliente.'
        });
    }
});

app.delete('/clientes/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const [resultado] = await db.query(
            'DELETE FROM clientes WHERE id = ?',
            [id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensagem: 'Cliente não encontrado.'
            });
        }

        res.json({
            mensagem: 'Cliente excluído com sucesso!'
        });

    } catch (erro) {
        console.error('Erro ao excluir cliente:', erro.message);
        res.status(500).json({
            mensagem: 'Erro ao excluir cliente.'
        });
    }
});

app.get('/produtos', async (req, res) => {
    try {
        const [produtos] = await db.query(
            'SELECT * FROM produtos ORDER BY id DESC'
        );

        res.json(produtos);

    } catch (erro) {
        console.error('Erro ao buscar produtos:', erro.message);
        res.status(500).json({
            mensagem: 'Erro ao buscar produtos.'
        });
    }
});

app.post('/produtos', async (req, res) => {
    try {
        const {
            nome,
            categoria,
            descricao,
            preco_compra,
            preco_venda,
            estoque,
            estoque_minimo
        } = req.body;

        const [resultado] = await db.query(
            `INSERT INTO produtos
            (nome, categoria, descricao, preco_compra, preco_venda, estoque, estoque_minimo)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                nome,
                categoria,
                descricao || null,
                preco_compra,
                preco_venda,
                estoque,
                estoque_minimo
            ]
        );

        res.status(201).json({
            mensagem: 'Produto cadastrado com sucesso!',
            id: resultado.insertId
        });

    } catch (erro) {
        console.error('Erro ao cadastrar produto:', erro.message);
        res.status(500).json({
            mensagem: 'Erro ao cadastrar produto.'
        });
    }
});

app.put('/produtos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const {
            nome,
            categoria,
            descricao,
            preco_compra,
            preco_venda,
            estoque,
            estoque_minimo
        } = req.body;

        const [resultado] = await db.query(
            `UPDATE produtos
            SET nome = ?, categoria = ?, descricao = ?,
                preco_compra = ?, preco_venda = ?,
                estoque = ?, estoque_minimo = ?
            WHERE id = ?`,
            [
                nome,
                categoria,
                descricao || null,
                preco_compra,
                preco_venda,
                estoque,
                estoque_minimo,
                id
            ]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensagem: 'Produto não encontrado.'
            });
        }

        res.json({
            mensagem: 'Produto atualizado com sucesso!'
        });

    } catch (erro) {
        console.error('Erro ao atualizar produto:', erro.message);
        res.status(500).json({
            mensagem: 'Erro ao atualizar produto.'
        });
    }
});

app.delete('/produtos/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const [resultado] = await db.query(
            'DELETE FROM produtos WHERE id = ?',
            [id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensagem: 'Produto não encontrado.'
            });
        }

        res.json({
            mensagem: 'Produto excluído com sucesso!'
        });

    } catch (erro) {
        console.error('Erro ao excluir produto:', erro.message);
        res.status(500).json({
            mensagem: 'Erro ao excluir produto.'
        });
    }
});

app.get('/servicos', async (req, res) => {
    try {
        const [servicos] = await db.query(
            'SELECT * FROM servicos ORDER BY id DESC'
        );

        res.json(servicos);

    } catch (erro) {
        console.error('Erro ao buscar serviços:', erro.message);
        res.status(500).json({
            mensagem: 'Erro ao buscar serviços.'
        });
    }
});

app.post('/servicos', async (req, res) => {
    try {
        const { nome, descricao, preco, duracao_minutos } = req.body;

        const [resultado] = await db.query(
            `INSERT INTO servicos
            (nome, descricao, preco, duracao_minutos)
            VALUES (?, ?, ?, ?)`,
            [nome, descricao || null, preco, duracao_minutos]
        );

        res.status(201).json({
            mensagem: 'Serviço cadastrado com sucesso!',
            id: resultado.insertId
        });

    } catch (erro) {
        console.error('Erro ao cadastrar serviço:', erro.message);
        res.status(500).json({
            mensagem: 'Erro ao cadastrar serviço.'
        });
    }
});

app.put('/servicos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, descricao, preco, duracao_minutos } = req.body;

        const [resultado] = await db.query(
            `UPDATE servicos
            SET nome = ?, descricao = ?, preco = ?, duracao_minutos = ?
            WHERE id = ?`,
            [nome, descricao || null, preco, duracao_minutos, id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensagem: 'Serviço não encontrado.'
            });
        }

        res.json({
            mensagem: 'Serviço atualizado com sucesso!'
        });

    } catch (erro) {
        console.error('Erro ao atualizar serviço:', erro.message);
        res.status(500).json({
            mensagem: 'Erro ao atualizar serviço.'
        });
    }
});

app.delete('/servicos/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const [resultado] = await db.query(
            'DELETE FROM servicos WHERE id = ?',
            [id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensagem: 'Serviço não encontrado.'
            });
        }

        res.json({
            mensagem: 'Serviço excluído com sucesso!'
        });

    } catch (erro) {
        console.error('Erro ao excluir serviço:', erro.message);
        res.status(500).json({
            mensagem: 'Erro ao excluir serviço.'
        });
    }
});

app.get('/vendas', async (req, res) => {
    try {
        const [vendas] = await db.query(`
            SELECT
                vendas.*,
                clientes.nome AS nome_cliente
            FROM vendas
            INNER JOIN clientes ON vendas.cliente_id = clientes.id
            ORDER BY vendas.id DESC
        `);

        res.json(vendas);

    } catch (erro) {
        console.error('Erro ao buscar vendas:', erro.message);
        res.status(500).json({
            mensagem: 'Erro ao buscar vendas.'
        });
    }
});

app.post('/vendas', async (req, res) => {
    const conexao = await db.getConnection();

    try {
        const { cliente_id, itens } = req.body;

        if (!cliente_id || !Array.isArray(itens) || itens.length === 0) {
            return res.status(400).json({
                mensagem: 'Informe o cliente e pelo menos um item.'
            });
        }

        await conexao.beginTransaction();

        let valorTotal = 0;
        const itensValidados = [];

        for (const item of itens) {
            const quantidade = Number(item.quantidade);

            if (!Number.isInteger(quantidade) || quantidade <= 0) {
                throw new Error('Quantidade inválida.');
            }

            let nomeItem;
            let precoUnitario;
            let produtoId = null;
            let servicoId = null;

            if (item.tipo === 'produto') {
                const [produtos] = await conexao.query(
                    'SELECT nome, preco_venda, estoque FROM produtos WHERE id = ? FOR UPDATE',
                    [item.item_id]
                );

                if (produtos.length === 0) {
                    throw new Error('Produto não encontrado.');
                }

                const produto = produtos[0];

                if (produto.estoque < quantidade) {
                    throw new Error(`Estoque insuficiente para ${produto.nome}.`);
                }

                nomeItem = produto.nome;
                precoUnitario = Number(produto.preco_venda);
                produtoId = item.item_id;

            } else if (item.tipo === 'servico') {
                const [servicos] = await conexao.query(
                    'SELECT nome, preco FROM servicos WHERE id = ?',
                    [item.item_id]
                );

                if (servicos.length === 0) {
                    throw new Error('Serviço não encontrado.');
                }

                nomeItem = servicos[0].nome;
                precoUnitario = Number(servicos[0].preco);
                servicoId = item.item_id;

            } else {
                throw new Error('Tipo de item inválido.');
            }

            const subtotal = precoUnitario * quantidade;
            valorTotal += subtotal;

            itensValidados.push({
                produto_id: produtoId,
                servico_id: servicoId,
                nome_item: nomeItem,
                preco_unitario: precoUnitario,
                quantidade,
                subtotal
            });
        }

        const [resultadoVenda] = await conexao.query(
            'INSERT INTO vendas (cliente_id, valor_total) VALUES (?, ?)',
            [cliente_id, valorTotal]
        );

        const vendaId = resultadoVenda.insertId;

        for (const item of itensValidados) {
            await conexao.query(
                `INSERT INTO itens_venda
                (venda_id, produto_id, servico_id, nome_item, preco_unitario, quantidade, subtotal)
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    vendaId,
                    item.produto_id,
                    item.servico_id,
                    item.nome_item,
                    item.preco_unitario,
                    item.quantidade,
                    item.subtotal
                ]
            );

            if (item.produto_id !== null) {
                await conexao.query(
                    'UPDATE produtos SET estoque = estoque - ? WHERE id = ?',
                    [item.quantidade, item.produto_id]
                );
            }
        }

        await conexao.commit();

        res.status(201).json({
            mensagem: 'Venda cadastrada com sucesso!',
            id: vendaId,
            valor_total: valorTotal
        });

    } catch (erro) {
        await conexao.rollback();

        console.error('Erro ao cadastrar venda:', erro.message);

        res.status(400).json({
            mensagem: erro.message || 'Erro ao cadastrar venda.'
        });

    } finally {
        conexao.release();
    }
});


app.get('/vendas/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const [vendas] = await db.query(`
            SELECT
                vendas.*,
                clientes.nome AS nome_cliente
            FROM vendas
            INNER JOIN clientes ON vendas.cliente_id = clientes.id
            WHERE vendas.id = ?
        `, [id]);

        if (vendas.length === 0) {
            return res.status(404).json({
                mensagem: 'Venda não encontrada.'
            });
        }

        const [itens] = await db.query(`
            SELECT
                id,
                nome_item,
                preco_unitario,
                quantidade,
                subtotal,
                produto_id,
                servico_id
            FROM itens_venda
            WHERE venda_id = ?
            ORDER BY id ASC
        `, [id]);

        res.json({
            ...vendas[0],
            itens
        });

    } catch (erro) {
        console.error('Erro ao buscar detalhes da venda:', erro.message);

        res.status(500).json({
            mensagem: 'Erro ao buscar detalhes da venda.'
        });
    }
});


app.get('/dashboard', async (req, res) => {
    try {
        const [clientes] = await db.query(
            'SELECT COUNT(*) AS total FROM clientes'
        );

        const [animais] = await db.query(
            'SELECT COUNT(*) AS total FROM animais'
        );

        const [produtos] = await db.query(
            'SELECT COUNT(*) AS total FROM produtos'
        );

        const [vendas] = await db.query(
            'SELECT COUNT(*) AS total FROM vendas'
        );

        res.json({
            clientes: clientes[0].total,
            animais: animais[0].total,
            produtos: produtos[0].total,
            vendas: vendas[0].total
        });

    } catch (erro) {
        console.error('Erro ao carregar Dashboard:', erro.message);

        res.status(500).json({
            mensagem: 'Erro ao buscar os dados do Dashboard.'
        });
    }
});

app.get('/teste-banco', async (req, res) => {
    try {
        const [resultado] = await db.query('SELECT 1 AS conectado');

        res.json({
            mensagem: 'Banco de dados conectado!',
            resultado
        });

    } catch (erro) {
        console.error('Erro ao conectar:', erro.message);
        res.status(500).json({
            mensagem: 'Não foi possível conectar ao banco.'
        });
    }
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});