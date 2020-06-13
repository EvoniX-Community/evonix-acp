import React, { useReducer } from 'react';

import api from '../../api/api';
import UserAppsContext from './userAppsContext';
import userAppsReducer from './userAppsReducer';

import {
    GET_ALL_USER_APPS,
    UPDATE_USER_APPS,
    USER_APPS_ERROR,
    CLEAR_USER_APPS_ERROR
} from '../types';

const UserAppsState = (props) => {
    const INITIAL_STATE = {
        user_apps: null,
        setLoading: true,
        error: null
    }

    const [state, dispatch] = useReducer(userAppsReducer, INITIAL_STATE);

    // API Requests
    const getAllUserApps = async () => {
        try {
            const res = await api.get('users/application');
            dispatch({ type: GET_ALL_USER_APPS, payload: res.data });
        } catch (error) {
            const errors = error.response.data.errors;
            dispatch({ type: USER_APPS_ERROR, payload: errors });
        }
    }

    const updateUserApps = async (status, id, user_id) => {
        try {
            const res = await api.put(`users/application/${status}/${id}/${user_id}`);
            dispatch({ type: UPDATE_USER_APPS, payload: res.data });
        } catch (error) {
            const errors = error.response.data.errors;
            dispatch({ type: USER_APPS_ERROR, payload: errors });
        }
    }

    const clearUserAppsErrors = () => {
        dispatch({ type: CLEAR_USER_APPS_ERROR });
    }

    return (
        <UserAppsContext.Provider
            value={{
                user_apps: state.user_apps,
                error: state.error,
                getAllUserApps,
                updateUserApps,
                clearUserAppsErrors
            }}
        >
            { props.children }
        </UserAppsContext.Provider>
    )
}

export default UserAppsState;