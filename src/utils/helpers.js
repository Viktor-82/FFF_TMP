// Сравнение продуктов с избранными
export const findFavoritesInProducts = (products, favorites) => {
    return products.filter(product =>
        favorites.some(fav => fav.productId === product.id && fav.productName === product.name)
    ).map(favoriteProduct => favoriteProduct.id); // Возвращаем только ID продуктов
};
