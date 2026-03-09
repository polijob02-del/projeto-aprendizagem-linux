const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

// 1. Configurações Globais (Demanda: CORS e JSON)
app.use(cors());
app.use(express.json());

// 2. Configuração do Diretório e Organização (Demanda: Armazenar e Integridade)
const uploadDir = path.join(__dirname, 'uploads');

// Garante que a pasta 'uploads' seja criada automaticamente ao iniciar o servidor
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Configuração do Multer: Onde salvar e como nomear os arquivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Adiciona um timestamp para evitar que arquivos com mesmo nome se sobrescrevam
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// 3. ROTAS DA API

// Rota de Upload (Demanda: Rota upload e Tratamento de erro)
app.post('/upload', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Nenhum arquivo foi enviado na requisição.' });
        }
        res.status(201).json({ 
            message: 'Upload concluído com sucesso', 
            filename: req.file.filename 
        });
    } catch (error) {
        console.error("Erro no upload:", error);
        res.status(500).json({ error: 'Falha interna ao processar o upload do arquivo.' });
    }
});

// Rota de Listagem (Demanda: Listar todos os arquivos)
app.get('/files', (req, res) => {
    try {
        const files = fs.readdirSync(uploadDir);
        res.status(200).json({ files });
    } catch (error) {
        console.error("Erro ao listar:", error);
        res.status(500).json({ error: 'Falha ao acessar o diretório de arquivos.' });
    }
});

// Rota de Download (Demanda: Download por nome)
app.get('/download/:filename', (req, res) => {
    try {
        const fileName = req.params.filename;
        const filePath = path.join(uploadDir, fileName);

        // Validação de segurança: verifica se o arquivo realmente existe no disco
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'Arquivo não encontrado no servidor.' });
        }
        res.download(filePath);
    } catch (error) {
        console.error("Erro no download:", error);
        res.status(500).json({ error: 'Falha interna ao preparar o download.' });
    }
});

// Rota de Exclusão (Demanda: Excluir do servidor)
app.delete('/files/:filename', (req, res) => {
    try {
        const fileName = req.params.filename;
        const filePath = path.join(uploadDir, fileName);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'Arquivo não encontrado para exclusão.' });
        }

        fs.unlinkSync(filePath); // Exclui fisicamente o arquivo do Linux
        res.status(200).json({ message: 'Arquivo excluído com sucesso do servidor.' });
    } catch (error) {
        console.error("Erro na exclusão:", error);
        res.status(500).json({ error: 'Falha interna ao tentar excluir o arquivo.' });
    }
});

// 4. Inicialização do Servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Diretório de armazenamento configurado em: ${uploadDir}`);
});