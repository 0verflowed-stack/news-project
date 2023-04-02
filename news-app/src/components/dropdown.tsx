import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import { gql } from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

const SET_CATEGORY = gql`
    mutation Mutation(
        $categoryInput: CategoryInput
    ) {
        updateCategory(
            categoryInput: $categoryInput
        )
    }
`;


interface IDropdownComponentProps {
    options: Array<{
        label: string,
        value: string
    }>,
    categoryProp: string,
    postId: string,
    categoryChangeHandler: (id: string, newCategory: string) => void
}

const DropdownComponent = ({ options, categoryProp, postId, categoryChangeHandler } : IDropdownComponentProps) => {
    const [value, setValue] = useState<string>(categoryProp);
    const [isFocus, setIsFocus] = useState(false);

    const [setCategoryMutation] = useMutation(SET_CATEGORY);

    const onChangeHandle = (value: string) => {
        const newValue = value;
        setCategoryMutation({ variables: { categoryInput: { category: newValue, postId }}});
        categoryChangeHandler(postId, newValue);
    };

    return (
        <View style={styles.container}>
            <Dropdown
                style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={options}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!isFocus ? 'Select category' : '...'}
                searchPlaceholder="Search..."
                value={value}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                    setValue(item.value);
                    onChangeHandle(item.value);
                    setIsFocus(false);
                }}
                renderLeftIcon={() => (
                    <AntDesign
                        style={styles.icon}
                        color={isFocus ? 'blue' : 'black'}
                        name="downcircleo"
                        size={18}
                    />
                )}
            />
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        padding: 16,
    },
    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    icon: {
        marginRight: 5,
    },
    label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
});

export default DropdownComponent;