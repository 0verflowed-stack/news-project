import { useState } from 'react';
import { gql } from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

interface ICategoryProps {
    category: string
    categories: string[]
    postId: string,
    categoryChangeHandler: (id: string, newCategory: string) => void
}

const SET_CATEGORY = gql`
    mutation Mutation(
        $categoryInput: CategoryInput
    ) {
        updateCategory(
            categoryInput: $categoryInput
        )
    }
`;

const Category = ({ category: categoryProp, categories, postId, categoryChangeHandler }: ICategoryProps ) => {
    const [category, setCategory] = useState(categoryProp);

    const [setCategoryMutation] = useMutation(SET_CATEGORY);

    const options = categories.map(name => (
        <option key={name} value={name}>{name ? name : 'Select category'}</option>
    ));

    const onChangeHandle = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newValue = e.target.value;
        console.log(newValue);
        setCategory(newValue);
        setCategoryMutation({ variables: { categoryInput: { category: newValue, postId }}});
        categoryChangeHandler(postId, newValue);
    };

    return (
        <div>
            <select style={{ borderRadius: "10px", padding: "5px 0 5px 5px" }} name="categories" id="category-select" onChange={onChangeHandle} value={category}>
                {options}
            </select>
        </div>
    );
};

export default Category;