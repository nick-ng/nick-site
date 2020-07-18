import React, { useState } from 'react';
import styled from 'styled-components';
import startCase from 'lodash/startCase';

const Select = styled.select``;

const Option = styled.option``;

const ItemSelector = ({ itemList, selectedItem, onSelect }) => {
    return (
        <Select
            onChange={e => {
                onSelect(e.target.value);
            }}
            value={selectedItem || '__blank'}
        >
            <Option value="__blank">Choose something</Option>
            {itemList.sort().map(item => (
                <Option key={item} value={item}>
                    {startCase(item)}
                </Option>
            ))}
        </Select>
    );
};

export default ItemSelector;
