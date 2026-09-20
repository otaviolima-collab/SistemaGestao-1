const express = require('express');
const router = express.Router();
const ItemController = require('../controllers/ItemController');

router.get('/', ItemController.listar);
router.get('/:id', ItemController.buscar);
router.post('/', ItemController.criar);
router.put('/:id', ItemController.atualizar);
router.delete('/:id', ItemController.excluir);

module.exports = router;
