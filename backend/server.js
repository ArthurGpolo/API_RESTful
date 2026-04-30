require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');

const swaggerSpec = require('./src/config/swagger');
const router = require('./src/routes');
const errorHandler = require('./src/middlewares/errorHandler');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api', router);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => {
  res.json({
    message: 'Alexandria API está no ar',
    docs: '/api-docs',
  });
});

app.use(errorHandler);

// IMPORTANTE: NÃO iniciar servidor aqui automaticamente
const PORT = process.env.PORT || 3001;

// Só sobe se NÃO for importado (isso evita quebrar testes)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log(`Docs: http://localhost:${PORT}/api-docs`);
  });
}

module.exports = app;