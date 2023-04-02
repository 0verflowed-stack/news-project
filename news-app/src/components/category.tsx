import { memo } from 'react';
import { View } from 'react-native';
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