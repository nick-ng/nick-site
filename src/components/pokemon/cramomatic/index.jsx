import React, { useState } from 'react';
import styled from 'styled-components';

import ItemSelector from './item-selector';
import AutoChooser from './auto-chooser';
import InventoryManager from './inventory-manager';
import { recipes } from './item-data';

const Container = styled.div`
    display: grid;
    grid-template-columns: auto auto;
    justify-content: start;
    gap: 1em;

    h1 {
        grid-column: 1 / 4;
    }

    @media screen and (max-device-width: 700px) {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }
`;

const Cramomatic = () => {
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [inventory, setInventory] = useState({});

    return (
        <Container>
            <h1>Cram-o-matic Helper</h1>
            <div>
                <h2>Item You Want</h2>
                <ItemSelector
                    itemList={Object.keys(recipes)}
                    selectedItem={selectedRecipe}
                    onSelect={setSelectedRecipe}
                />
                <AutoChooser
                    desiredItem={selectedRecipe}
                    inventory={inventory}
                />
            </div>
            <InventoryManager updateInventory={setInventory} />
        </Container>
    );
};

export default Cramomatic;
