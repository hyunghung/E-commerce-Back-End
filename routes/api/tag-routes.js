const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  try {
    // Find all tags and include associated Product data
    const tagsData = await Tag.findAll({
      include: Product
    });
    res.json(tagsData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    // Find a single tag by its `id` and include associated Product data
    const tagData = await Tag.findByPk(req.params.id, {
      include: Product
    });

    if (!tagData) {
      res.status(404).json({ message: 'Tag not found' });
      return;
    }

    res.json(tagData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  try {
    // Create a new tag
    const newTag = await Tag.create(req.body);
    res.status(201).json(newTag);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.put('/:id', async (req, res) => {
  try {
    // Update a tag's name by its `id` value
    const updatedTag = await Tag.update(req.body, {
      where: {
        id: req.params.id
      }
    });
    res.json(updatedTag);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    // Delete one tag by its `id` value
    const deletedTag = await Tag.destroy({
      where: {
        id: req.params.id
      }
    });
    res.json(deletedTag);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
