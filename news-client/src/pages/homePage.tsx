import React, { useContext } from 'react';
import NewsFeed from '../components/newsFeed';
import { AuthContext } from '../context/authContext';
import IAuthContext from '../interfaces/authContext';

const HomePage = () : JSX.Element => {
    const { user } = useContext<IAuthContext>(AuthContext);
    
    return (
       <>
        <h2>Home Page</h2>
        {user ? (
            <>
                <h2>{user.email} is logined</h2>
                <NewsFeed/>
            </>
        ) : (
            <p>Log in to access news</p>
        )}
        </>
    );
};

export default HomePage;