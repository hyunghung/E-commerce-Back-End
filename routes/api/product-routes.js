const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  try {
    // Find all products and include their associated Category and Tag data
    const productsData = await Product.findAll({
      include: [
        { model: Category }, // Include Category model
        { model: Tag },      // Include Tag model
      ],
    });
    res.json(productsData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// get one product by id
router.get('/:id', async (req, res) => {
  try {
    // Find a single product by its `id` and include its associated Category and Tag data
    const productData = await Product.findByPk(req.params.id, {
      include: [
        { model: Category }, // Include Category model
        { model: Tag },      // Include Tag model
      ],
    });

    if (!productData) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    res.json(productData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// create new product
router.post('/', (req, res) => {
  Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// update product
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      if (req.body.tagIds && req.body.tagIds.length) {

        ProductTag.findAll({
          where: { product_id: req.params.id }
        }).then((productTags) => {
          // create filtered list of new tag_ids
          const productTagIds = productTags.map(({ tag_id }) => tag_id);
          const newProductTags = req.body.tagIds
            .filter((tag_id) => !productTagIds.includes(tag_id))
            .map((tag_id) => {
              return {
                product_id: req.params.id,
                tag_id,
              };
            });

          // figure out which ones to remove
          const productTagsToRemove = productTags
            .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
            .map(({ id }) => id);
          // run both actions
          return Promise.all([
            ProductTag.destroy({ where: { id: productTagsToRemove } }),
            ProductTag.bulkCreate(newProductTags),
          ]);
        });
      }

      return res.json(product);
    })
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete('/:id', async (req, res) => {
  try {
    const productId = req.params.id;

    // First, delete the associations between the product and tags in the ProductTag table
    await ProductTag.destroy({
      where: {
        product_id: productId
      }
    });

    // Now, delete the product
    await Product.destroy({
      where: {
        id: productId
      }
    });

    res.json({ message: 'Product and associated tags deleted' });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});



module.exports = router;
