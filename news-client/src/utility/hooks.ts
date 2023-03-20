import { useState } from 'react';

export const useForm = (callback: () => void, initialState: object = {}) => {
    const [values, setValues] = useState(initialState);

    const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setValues({
            ...values,
            [e.target.name]: e.target.value
        });
        console.log(values);
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        callback();
    };

    return {
        onChange,
        onSubmit,
        values
    };
};