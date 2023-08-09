const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  try {
    // Find all categories and include their associated Products
    const categoriesData = await Category.findAll({
      include: Product
    });
    res.json(categoriesData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    // Find one category by its `id` value and include its associated Products
    const categoryData = await Category.findByPk(req.params.id, {
      include: Product
    });

    if (!categoryData) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }

    res.json(categoryData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  try {
    // Create a new category
    const newCategory = await Category.create(req.body);
    res.status(201).json(newCategory);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.put('/:id', async (req, res) => {
  try {
    // Update a category by its `id` value
    const updatedCategory = await Category.update(req.body, {
      where: {
        id: req.params.id
      }
    });
    res.json(updatedCategory);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    // Delete a category by its `id` value
    await Category.destroy({
      where: {
        id: req.params.id
      }
    });

    res.json({ message: 'Category deleted' }); // Update the response message
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});


module.exports = router;
