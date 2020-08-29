import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import startCase from 'lodash/startCase';

import { ingredientNames, ingredients, recipes } from './item-data';
import { validRemainingItems } from './utils';

const Container = styled.div`
  justify-self: center;
`;

const Recipe = styled.div`
  margin-top: 1em;
  display: grid;
  justify-content: start;
  grid-template-columns: repeat(4, auto);
  gap: 0.5em;
`;

const RecipeHeading = styled.div`
  font-weight: bold;
  text-align: ${(props) => props.textAlign || 'left'};
`;

const RecipeItem = styled.div`
  text-align: ${(props) => props.textAlign || 'left'};
`;

const BASE_VALUE = 1000000;

const randomItem = (items) => items[Math.floor(Math.random() * items.length)];

const getItemPrice = (count) => BASE_VALUE - count;

const makeItem = (
  desiredItem,
  inventory,
  startingPrice = Infinity,
  count = 10
) => {
  let bestPrice = startingPrice;
  let bestItems = [];

  const prices = ingredientNames.reduce((prev, name) => {
    prev[name] = getItemPrice(inventory[name]?.count || 0);
    return prev;
  }, {});

  const excludedItems = Object.keys(inventory).filter(
    (item) => inventory[item]?.exclude
  );

  const recipe = recipes[desiredItem];

  for (let n = 0; n < count; n++) {
    const tempItems = [];
    const itemsA = validRemainingItems(
      recipe.range,
      [],
      [desiredItem, ...excludedItems]
    ).filter((ingredient) =>
      recipe?.types.includes(ingredients[ingredient].type)
    );
    tempItems.push(randomItem(itemsA));
    for (let m = 0; m < 2; m++) {
      const itemsB = validRemainingItems(recipe.range, tempItems, [
        desiredItem,
        ...excludedItems,
      ]);
      tempItems.push(randomItem(itemsB));
    }
    const itemsC = validRemainingItems(recipe.range, tempItems, [
      desiredItem,
      ...excludedItems,
    ]);
    itemsC.sort((a, b) => prices[a] - prices[b]);
    tempItems.push(itemsC[0]);
    const resultPrice = tempItems.reduce((prev, item) => {
      return prev + prices[item];
    }, 0);

    if (resultPrice <= bestPrice) {
      bestPrice = resultPrice;
      bestItems = tempItems;
    }
  }

  return {
    bestPrice,
    bestItems,
  };
};

const AutoChooser = ({ desiredItem, inventory }) => {
  const [price, setPrice] = useState(Infinity);
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (Object.keys(recipes).includes(desiredItem)) {
      const { bestPrice, bestItems } = makeItem(
        desiredItem,
        inventory,
        Infinity,
        50
      );
      setPrice(bestPrice);
      setItems(bestItems);
    } else {
      setPrice(Infinity);
      setItems([]);
    }
  }, [desiredItem, inventory]);

  return (
    <Container>
      <h2>Auto Chooser</h2>
      {Object.keys(recipes).includes(desiredItem) ? (
        <div>
          <p>{`Making ${startCase(desiredItem)} (${
            recipes[desiredItem].range[0]
          } - ${recipes[desiredItem].range[1]})`}</p>
        </div>
      ) : (
        <h3>Choose an item</h3>
      )}
      {Object.keys(recipes).includes(desiredItem) && (
        <button
          onClick={() => {
            const temp = makeItem(desiredItem, inventory, price, 500);
            if (temp.bestPrice <= price && temp.bestItems.length === 4) {
              setPrice(temp.bestPrice);
              setItems(temp.bestItems);
            }
          }}
        >
          Try Again
        </button>
      )}
      {items.length > 0 && (
        <Recipe>
          <RecipeHeading>Item</RecipeHeading>
          <RecipeHeading textAlign="right">Value</RecipeHeading>
          <RecipeHeading textAlign="center">Type</RecipeHeading>
          <RecipeHeading textAlign="right">##</RecipeHeading>
          {items.map((item, i) => (
            <React.Fragment key={`${item}${i}`}>
              <RecipeItem>
                <a
                  href={`https://www.serebii.net/itemdex/${item
                    .replace(/_/g, '')
                    .replace(/'/g, '')}.shtml`}
                  target="_blank"
                >
                  {startCase(item)}
                </a>
              </RecipeItem>
              <RecipeItem textAlign="right">
                {ingredients[item].value}
              </RecipeItem>
              <RecipeItem textAlign="center">
                {startCase(ingredients[item].type)}
              </RecipeItem>
              <RecipeItem textAlign="right">{inventory[item].count}</RecipeItem>
            </React.Fragment>
          ))}
          <RecipeHeading>Totals</RecipeHeading>
          <RecipeHeading textAlign="right">
            {items.reduce((prev, item) => prev + ingredients[item].value, 0)}
          </RecipeHeading>
          <div />
          <RecipeHeading textAlign="right">
            {items.reduce((prev, item) => prev + inventory[item].count, 0)}
          </RecipeHeading>
        </Recipe>
      )}
    </Container>
  );
};

export default AutoChooser;
