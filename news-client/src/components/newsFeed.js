import { useState } from 'react';
import NewsItem from "./news";
import { gql } from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { Alert } from '@mui/material';

const GET_NEWS = gql`
    query News {
        news {
            category
            comments {
                username
                body
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

const NewsFeed = () => {
    const [errors, setErrors] = useState([]);
    const [news, setNews] = useState([]);
    useQuery(GET_NEWS, {
        onCompleted(data) {
            setNews(data.news);
        },
        onError({ graphQLErrors }) {
            setErrors(graphQLErrors);
        }
    });
    return (
        <>
            {news.map((newsItem, idx) => (
                <NewsItem item={newsItem} key={idx} />
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
