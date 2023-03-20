import { useState, useEffect, useRef } from 'react';
import NewsItem from "./news";
import { gql } from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { Alert } from '@mui/material';
import { GraphQLErrors } from '@apollo/client/errors';
import INews from '../interfaces/news';
import styled from "styled-components";

const CategoryButton = styled.button`
    margin: 5px;
    background-color: white;
    border: 1px solid black;
    border-radius: 10px;
    padding: 5px;
    &:first-child {
        margin-left: 15px;
    }
`;

const GET_NEWS = gql`
    query News {
        news {
            category
            comments {
                id
                username
                body
                date
            }
            dislikes
            disliked
            likes
            liked
            time
            title
            id
        }
    }
`;

const GET_CATEGORIES = gql`
    query Categories {
        categories
    }
`;

const READ_LATER = 'Read later';

const NewsFeed = () => {
    const [errors, setErrors] = useState<GraphQLErrors>([]);
    const [news, setNews] = useState<INews[]>([]);
    const [categories, setCategories] = useState([]);
    const [currentCategory, setCurrentCategory] = useState('');
    const itemsRef = useRef<Array<HTMLDivElement | null>>([]);

    useQuery(GET_NEWS, {
        onCompleted(data) {
            setNews(data.news);
        },
        onError({ graphQLErrors }) {
            setErrors(graphQLErrors);
        }
    });

    useQuery(GET_CATEGORIES, {
        onCompleted(data) {
            setCategories(data.categories);
        },
        onError({ graphQLErrors }) {
            setErrors(graphQLErrors);
        }
    });
    
    const filteredNews = news.filter(x => {
        if (currentCategory === '') {
            return true;
        }
        return x.category === currentCategory;
    });

    let notificationNewsItem : INews | undefined;

    const readLaterArticle = news.find(x => x.category === READ_LATER);

    let notificationTitle = '';

    if (readLaterArticle) {
        notificationNewsItem = readLaterArticle;
        notificationTitle = "Don't forget to view your 'Read later' article";
    } else {
        notificationNewsItem = news[0];
        notificationTitle = "Don't forget to view the latest news";
    }

    useEffect(() => {
        const seed = setInterval(() => {
            Notification.requestPermission().then(perm => {
                if (perm === "granted" && notificationNewsItem) {
                    const notification = new Notification(notificationTitle, {
                        body: notificationNewsItem.title
                    });

                    notification.addEventListener('click', () => {
                        if (readLaterArticle) {
                            setCurrentCategory(READ_LATER);
                        } else {
                            setCurrentCategory('');
                        }
                        // @ts-ignore
                        itemsRef.current[notificationNewsItem.id]?.scrollIntoView();
                        // @ts-ignore
                        itemsRef.current[notificationNewsItem.id]?.classList.add('bgGray');
                    });
                }
            });
        }, 10 * 60 * 1000);

        return () => {
            clearInterval(seed);
        };
    }, [notificationNewsItem, notificationTitle]);

    const categoryChangeHandler = (id: string, newCategory: string) => {
        setNews(prev => {
            const idx = prev.findIndex(x => x.id === id);
            const tempArray = [...prev];
            const tempNews = { ...tempArray[idx] };
            tempNews.category = newCategory;
            tempArray[idx] = tempNews;
            return tempArray;
        });
    };

    return (
        <>
            <div>
                {categories.map(x => {
                    const text = x === '' ? 'All' : x;
                    return (
                        <CategoryButton className={x === currentCategory ? 'btnBgGray' : ''} key={x} onClick={() => setCurrentCategory(x)}>{text}</CategoryButton>
                    );
                })}
            </div>
            {filteredNews.map((newsItem) => (
                <NewsItem
                    item={newsItem}
                    key={newsItem.id}
                    categories={categories}
                    categoryChangeHandler={categoryChangeHandler}
                    // @ts-ignore
                    ref={el => itemsRef.current[newsItem.id] = el} 
                />
            ))}
            {errors.map((error, idx) => {
                return (
                    <Alert severity="error" key={idx}>
                        {error.message}
                    </Alert>
                );
            })}
        </>
    );
};

export default NewsFeed;
