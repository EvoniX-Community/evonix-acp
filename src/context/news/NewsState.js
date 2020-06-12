import React, { useReducer } from 'react';
import axios from 'axios';
import history from '../../components/history';

import NewsContext from './newsContext';
import newsReducer from './newsReducer';

import {
    GET_ALL_NEWS,
    ADD_NEWS,
    DELETE_NEWS,
    SET_CURRENT_NEWS,
    CLEAR_CURRENT_NEWS,
    UPDATE_NEWS,
    CLEAR_NEWS,
    NEWS_ERROR,
    CLEAR_NEWS_ERROR
} from '../types';

const NewsState = (props) => {
    const INITIAL_STATE = {
        news: null,
        current_news: null,
        setLoading: true,
        error: null
    }

    const [state, dispatch] = useReducer(newsReducer, INITIAL_STATE);

    // API Requests
    const getAllNews = async () => {
        try {
            const res = await axios.get('http://167.99.65.76:5000/api/v1/news');
            dispatch({ type: GET_ALL_NEWS, payload: res.data });
        } catch (error) {
            const errors = error.response.data.errors;
            dispatch({ type: NEWS_ERROR, payload: errors });
        }
    }

    const addNews = async news => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        try {
            const res = await axios.post('http://167.99.65.76:5000/api/v1/news', news, config);
            dispatch({ type: ADD_NEWS, payload: res.data });
            history.push('/news');
        } catch (error) {
            const errors = error.response.data.errors;
            dispatch({ type: NEWS_ERROR, payload: errors });
        }
    }

    const updateNews = async news => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        try {
            const res = await axios.put(`http://167.99.65.76:5000/api/v1/news/${news.id}`, news, config);
            dispatch({ type: UPDATE_NEWS, payload: res.data });
            history.push('/news');
        } catch (error) {
            const errors = error.response.data.errors;
            dispatch({ type: NEWS_ERROR, payload: errors });
        }
    }

    const deleteNews = async id => {
        try {
            await axios.delete(`http://167.99.65.76:5000/api/v1/news/${id}`);
            dispatch({ type: DELETE_NEWS, payload: id });
        } catch (error) {
            const errors = error.response.data.errors;
            dispatch({ type: NEWS_ERROR, payload: errors });
        }
    }

    const clearNews = () => {
        dispatch({ type: CLEAR_NEWS });
    }

    const setCurrentNews = news => {
        dispatch({ type: SET_CURRENT_NEWS, payload: news });
    }

    const clearCurrentNews = () => {
        dispatch({ type: CLEAR_CURRENT_NEWS });
    }

    const clearNewsErrors = () => {
        dispatch({ type: CLEAR_NEWS_ERROR });
    }

    return (
        <NewsContext.Provider
            value={{
                news: state.news,
                current_news: state.current_news,
                error: state.error,
                addNews,
                deleteNews,
                setCurrentNews,
                clearCurrentNews,
                updateNews,
                getAllNews,
                clearNews,
                clearNewsErrors
            }}
        >
            { props.children }
        </NewsContext.Provider>
    )
}

export default NewsState;