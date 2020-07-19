import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import startCase from 'lodash/startCase';

import ItemSelector from './item-selector';
import { ingredientNames, ingredients, recipes } from './item-data';
import { validRemainingItems } from './utils';

const CRAMOMATIC_STORAGE_KEY = 'CRAMOMATIC_STORAGE_KEY';

const Container = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;

    h1 {
        grid-column: 1 / 3;
    }
`;

const ItemMaker = styled.div`
    display: flex;
    flex-direction: column;
`;

const Item4Choices = styled.ul`
    margin-top: 0;
`;

const InventoryManagement = styled.div`
    justify-self: center;
`;

const Cramomatic = () => {
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [selectedIngredient1, setSelectedIngredient1] = useState(null);
    const [selectedIngredient2, setSelectedIngredient2] = useState(null);
    const [selectedIngredient3, setSelectedIngredient3] = useState(null);
    const [remainingIngredients1, setRemainingIngredients1] = useState(
        ingredientNames
    );
    const [remainingIngredients2, setRemainingIngredients2] = useState(
        ingredientNames
    );
    const [remainingIngredients3, setRemainingIngredients3] = useState(
        ingredientNames
    );
    const [remainingIngredients4, setRemainingIngredients4] = useState(
        ingredientNames
    );
    const [excludedItems, setExcludedItems] = useState(
        JSON.parse(localStorage.getItem(CRAMOMATIC_STORAGE_KEY) || '[]')
    );
    const [itemFilter, setItemFilter] = useState('');

    const range = selectedRecipe ? recipes[selectedRecipe].range : [0, 0];

    useEffect(() => {
        setSelectedIngredient1(null);
        setSelectedIngredient2(null);
        setSelectedIngredient3(null);
        setRemainingIngredients1(
            validRemainingItems(
                range,
                [],
                [selectedRecipe, ...excludedItems]
            ).filter(ingredient =>
                recipes[selectedRecipe]?.types.includes(
                    ingredients[ingredient].type
                )
            )
        );
    }, [selectedRecipe, excludedItems]);

    useEffect(() => {
        setRemainingIngredients2(
            validRemainingItems(
                range,
                [selectedIngredient1],
                [selectedRecipe, ...excludedItems]
            )
        );
        setRemainingIngredients3(
            validRemainingItems(
                range,
                [selectedIngredient1, selectedIngredient2],
                [selectedRecipe, ...excludedItems]
            )
        );
        setRemainingIngredients4(
            validRemainingItems(
                range,
                [selectedIngredient1, selectedIngredient2, selectedIngredient3],
                [selectedRecipe, ...excludedItems]
            )
        );
    }, [
        selectedIngredient1,
        selectedIngredient2,
        selectedIngredient3,
        excludedItems,
    ]);

    useEffect(() => {
        localStorage.setItem(
            CRAMOMATIC_STORAGE_KEY,
            JSON.stringify(excludedItems)
        );
    }, [excludedItems]);

    return (
        <Container>
            <h1>Cram-o-matic Helper</h1>
            <ItemMaker>
                <h2>Item You Want</h2>
                <ItemSelector
                    itemList={Object.keys(recipes)}
                    selectedItem={selectedRecipe}
                    onSelect={setSelectedRecipe}
                />
                <h2>Ingredients</h2>
                <ItemSelector
                    itemList={remainingIngredients1}
                    selectedItem={selectedIngredient1}
                    onSelect={setSelectedIngredient1}
                />
                <ItemSelector
                    itemList={remainingIngredients2}
                    selectedItem={selectedIngredient2}
                    onSelect={setSelectedIngredient2}
                />
                <ItemSelector
                    itemList={remainingIngredients3}
                    selectedItem={selectedIngredient3}
                    onSelect={setSelectedIngredient3}
                />
                <span>Fourth Item:</span>
                <Item4Choices>
                    {remainingIngredients4.map(ingredient => (
                        <li key={ingredient}>{startCase(ingredient)}</li>
                    ))}
                </Item4Choices>
            </ItemMaker>
            <InventoryManagement>
                <label>
                    Item Filter
                    <input
                        value={itemFilter}
                        onChange={e => {
                            setItemFilter(e.target.value);
                        }}
                    />
                    <button onClick={() => setItemFilter('')}>Clear</button>
                </label>
                <table>
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Exclude</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ingredientNames
                            .filter(i => i.includes(itemFilter))
                            .map(ingredient => {
                                const checked = excludedItems.includes(
                                    ingredient
                                );
                                return (
                                    <tr key={ingredient}>
                                        <td>{startCase(ingredient)}</td>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={checked}
                                                onChange={() => {
                                                    if (checked) {
                                                        setExcludedItems(
                                                            excludedItems.filter(
                                                                a =>
                                                                    a !==
                                                                    ingredient
                                                            )
                                                        );
                                                    } else {
                                                        setExcludedItems(
                                                            excludedItems.concat(
                                                                [ingredient]
                                                            )
                                                        );
                                                    }
                                                }}
                                            />
                                        </td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
            </InventoryManagement>
        </Container>
    );
};

export default Cramomatic;
