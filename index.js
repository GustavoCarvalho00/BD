// Importa as dependencias
const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const Usuario = require('./usuario');

// Inicializa o server utilizando o express
const app = express();

// Utiliza a porta 50990 para escutar as requisições
const porta = 50990;

// Define o tipo de corpo das requisições como JSON
app.use(bodyParser.json())

// Define a requisição GET para o caminho /usuario/{cpf}
app.get('/usuario/:cpf', (req, res) => {
    let usuarios = lerUsuarios();
    console.log(usuarios);
    for (let usuario of usuarios) {
        console.log(usuario);
        if (usuario.cpf == req.params.cpf) {
            res.json(usuario);
            return;
        }
    }
    res.send('Usuario não encontrado!');
});

// Define a requisição GET para o caminho principal (Com explicações dos caminhos implementados)
app.get('/', (req, res) => {
    res.send('App de teste Funcionando! Rotas configuradas: "/usuario/" -> GET: /usuario/{cpf} ; POST: /usuario');
});

// Define a requisição POST para o caminho /usuario (Recebe um JSON com os dados do Usuario -> nome, cpf e data_nascimento)
app.post('/usuario', (req, res) => {
    res.send(salvarUsuarios(req.body));
});

// Inicializa a aplicação para escutar requisições na porta definida
app.listen(porta, () => {
    console.log(`App rodando em: http://localhost:${porta}`);
});

// Função que lê os usuarios do arquivo usuarios.json
function lerUsuarios() {
    let usuarios = [];
    try {
        usuarios = fs.readFileSync('usuarios.json');
        usuarios = JSON.parse(usuarios);
    } catch (e) {
        fs.writeFileSync('usuarios.json', JSON.stringify(usuarios));
    }
    return usuarios;
}

// Função que salva o novo usuario no arquivo usuarios.json
function salvarUsuarios(novoUsuario) {
    let usuarios = lerUsuarios();
    try {
        if (novoUsuario.cpf && novoUsuario.nome && novoUsuario.data_nascimento) {
            usuarios.push(new Usuario(novoUsuario.cpf, novoUsuario.nome, novoUsuario.data_nascimento));
            fs.writeFileSync('usuarios.json', JSON.stringify(usuarios));
            return `Usuario de cpf: ${novoUsuario.cpf}, nome: ${novoUsuario.nome} e data_nascimento: ${novoUsuario.data_nascimento} foi salvo com sucesso!`;
        } else {
            return 'Erro! Objeto com dados invalidos!';
        }
    } catch (e) {
        return 'Algo de inesperado aconteceu!';
    }
}