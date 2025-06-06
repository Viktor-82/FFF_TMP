import React from "react";
import IconFruits from "../img/categories_page/fruits_24.svg";
import IconVegetables from "../img/categories_page/vegetables_24.svg";
import IconGrainsLegumes from "../img/categories_page/grains_legumes_24.svg";
import IconNutsSeeds from "../img/categories_page/nuts_seeds_24.svg";
import IconDairyProducts from "../img/categories_page/dayry_products_24.svg";
import IconMeatPoultry from "../img/categories_page/meat_poultry_24.svg";
import IconEggs from "../img/categories_page/eggs_24.svg";
import IconSeafood from "../img/categories_page/seafood_24.svg";
import IconHoney from "../img/categories_page/honey_24.svg";
import IconHerbs from "../img/categories_page/herbs_24.svg";
import IconFlowers from "../img/categories_page/flowers_24.svg";
import IconProcessedProducts from "../img/categories_page/processed_products_24.svg";
import IconBakery from "../img/categories_page/bakary_24.svg";
import IconBeverages from "../img/categories_page/beverages_24.svg";
import IconOrganic from "../img/categories_page/organic_24.svg";
import IconGlutenFree from "../img/categories_page/gluten_free_24.svg";
import IconCraftMaterials from "../img/categories_page/craft_materials_24.svg";
import IconFertilizers from "../img/categories_page/fertilizers_24.svg";
import IconSeasonalGoods from "../img/categories_page/seasons_goods_24.svg";
import IconLiveAnimals from "../img/categories_page/live_animals_24.svg";
import IconOthers from "../img/categories_page/others_24.svg";
import IconDefault from "../img/categories_page/default_categories_24.svg";


export const getCategoryIcon = ( categoryName ) => {
    const icons = {
        "Fruits": <IconFruits/>,
        "Vegetables": <IconVegetables/>,
        "Grains and Legumes": <IconGrainsLegumes/>,
        "Nuts and Seeds": <IconNutsSeeds/>,
        "Dairy Products": <IconDairyProducts/>,
        "Meat and Poultry": <IconMeatPoultry/>,
        "Eggs": <IconEggs/>,
        "Seafood": <IconSeafood/>,
        "Honey and Bee Products": <IconHoney/>,
        "Herbs and Spices": <IconHerbs/>,
        "Flowers and Decorative Plants": <IconFlowers/>,
        "Processed Products": <IconProcessedProducts/>,
        "Bakery and Confectionery": <IconBakery/>,
        "Beverages": <IconBeverages/>,
        "Organic Products": <IconOrganic/>,
        "Gluten-Free and Dietary Products": <IconGlutenFree/>,
        "Craft Materials": <IconCraftMaterials/>,
        "Fertilizers and Garden Supplies": <IconFertilizers/>,
        "Seasonal Goods": <IconSeasonalGoods/>,
        "Live Animals and Services": <IconLiveAnimals/>,
        "Others": <IconOthers/>,
    };
    return icons[categoryName.trim()] || <IconDefault />
};