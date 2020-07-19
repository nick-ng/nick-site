import { ingredients } from './item-data';

const numberOfItemsSelected = items => {
    return items.filter(item => item).length;
};

export const selectedItemsTotal = items => {
    let currentTotal = 0;
    items.forEach(item => {
        if (item) {
            currentTotal = currentTotal + ingredients[item].value;
        }
    });

    return currentTotal;
};

export const validRemainingItems = (
    range,
    selectedItems,
    excludedItems = []
) => {
    const [lower, upper] = range;
    const allowedIngredients = Object.values(ingredients).filter(
        ingredient => !excludedItems.includes(ingredient.item)
    );

    const currentTotal = selectedItemsTotal(selectedItems);
    const itemsSelected = numberOfItemsSelected(selectedItems);
    const remainingItems = 4 - itemsSelected;

    const remainingValueLower = lower - currentTotal;
    const remainingValueUpper = upper - currentTotal;
    const lowestItem = Math.min(
        ...allowedIngredients.map(ingredient => ingredient.value)
    );
    const highestItem = Math.max(
        ...allowedIngredients.map(ingredient => ingredient.value)
    );

    const validMin = remainingValueLower - highestItem * (remainingItems - 1);
    const validMax = remainingValueUpper - lowestItem * (remainingItems - 1);

    return allowedIngredients
        .filter(
            ingredient =>
                ingredient.value <= validMax && ingredient.value >= validMin
        )
        .map(ingredient => ingredient.item);
};
