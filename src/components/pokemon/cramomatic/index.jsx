import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import ItemSelector from './item-selector';
import { ingredients, recipes } from './item-data';

const Container = styled.div``;

const Cramomatic = () => {
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [selectedIngredient1, setSelectedIngredient1] = useState({});
    const [selectedIngredient2, setSelectedIngredient2] = useState({});
    const [selectedIngredient3, setSelectedIngredient3] = useState({});
    const [remainingIngredients1, setRemainingIngredients1] = useState(
        Object.keys(ingredients)
    );
    const [remainingIngredients2, setRemainingIngredients2] = useState(
        Object.keys(ingredients)
    );
    const [remainingIngredients3, setRemainingIngredients3] = useState(
        Object.keys(ingredients)
    );
    const [remainingIngredients4, setRemainingIngredients4] = useState(
        Object.keys(ingredients)
    );

    useEffect(() => {
        console.log(
            'a',
            Object.keys(ingredients).filter(ingredient =>
                recipes[selectedRecipe]?.types.includes(
                    ingredients[ingredient].type
                )
            )
        );
        setSelectedIngredient1(null);
        setSelectedIngredient2(null);
        setSelectedIngredient3(null);
        setRemainingIngredients1(
            Object.keys(ingredients).filter(ingredient =>
                recipes[selectedRecipe]?.types.includes(
                    ingredients[ingredient].type
                )
            )
        );
        setRemainingIngredients2(Object.keys(ingredients));
        setRemainingIngredients3(Object.keys(ingredients));
        setRemainingIngredients4(Object.keys(ingredients));
    }, [selectedRecipe]);

    // useEffect(() => {
    //     setSelectedIngredient1({});
    //     setSelectedIngredient2({});
    //     setSelectedIngredient3({});
    //     setRemainingIngredients2(ingredients);
    //     setRemainingIngredients3(ingredients);
    //     setRemainingIngredients4(ingredients);
    // }, [recipes[selectedRecipe].item]);

    return (
        <Container>
            <h1>Cram-o-matic Helper</h1>
            <h2>Item You Want</h2>
            <ItemSelector
                itemList={Object.keys(recipes)}
                selectedItem={selectedRecipe}
                onSelect={setSelectedRecipe}
            />
            {recipes[selectedRecipe] && (
                <div>
                    <div>{`Range: ${recipes[selectedRecipe].range[0]} - ${recipes[selectedRecipe].range[1]}`}</div>
                </div>
            )}
            <h2>Ingredients</h2>
            {remainingIngredients1.length}
            <ItemSelector
                itemList={remainingIngredients1}
                selectedItem={selectedIngredient1}
                onSelect={setSelectedIngredient1}
            />
            {remainingIngredients2.length}
            <ItemSelector
                itemList={remainingIngredients2}
                selectedItem={selectedIngredient2}
                onSelect={setSelectedIngredient2}
            />
            {remainingIngredients3.length}
            <ItemSelector
                itemList={remainingIngredients3}
                selectedItem={selectedIngredient3}
                onSelect={setSelectedIngredient3}
            />
            {remainingIngredients4.length}
            <pre>{JSON.stringify(remainingIngredients3, null, '  ')}</pre>
        </Container>
    );
};

export default Cramomatic;
