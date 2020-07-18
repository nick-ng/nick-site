import { ingredients } from './item-data';

export const validRemainingItems = (range, items) => {
    const [lower, upper] = range;

    const currentTotal = 0;
    const itemsSelected = 0;

    items.forEach(item => {
        if (typeof item.value === 'number') {
            itemsSelected++;
            currentTotal = currentTotal + item.value;
        }
    });

    console.log('currentTotal', currentTotal);
};
