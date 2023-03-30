import { memo, useState } from 'react';
import { gql } from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { View, StyleSheet, Text, Button } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Dropdown } from 'react-native-element-dropdown';
import DropdownComponent from './dropdown';

interface ICategoryProps {
    category: string
    categories: string[]
    postId: string,
    categoryChangeHandler: (id: string, newCategory: string) => void
}


const Category = ({ category: categoryProp, categories, postId, categoryChangeHandler } : ICategoryProps ) => {
    const options = categories.map(name => ({ value: name, label: name ? name : 'All' }));

    return (
        <View>
             <DropdownComponent
                options={options}
                categoryProp={categoryProp}
                postId={postId}
                categoryChangeHandler={categoryChangeHandler}
             />
        </View>
    );
};

export default memo(Category);