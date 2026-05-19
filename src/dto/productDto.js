const productDto = (product) => {
  return {
    id: product.id,
    product_name: product.product_name,
    carving_item: product.carving_item,
    turning_item: product.turning_item,
    type: product.type,
    category: product.category_name,
    description: product.description,
  };
};

module.exports = productDto;
