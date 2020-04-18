import axios from 'axios';

import * as actionTypes from './actionTypes';

const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    };
};

const authSuccess = (token, userId) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        token: token,
        userId: userId
    };
};

const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    };
};

export const auth = (email, password, isSignup) => {
    return dispatch => {
        dispatch(authStart());
        const authData = {
            email: email,
            password: password,
            returnSecureToken: true
        };

        const apiKey = 'AIzaSyA134d9iuzrIHb7zZqLmowsNEpEScFcOhU';

        let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + apiKey;
        if (!isSignup) {
            url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + apiKey;
        }

        axios.post(url, authData)
            .then(response => {
                dispatch(authSuccess(
                    response.data.idToken,
                    response.data.localId
                ));
            })
            .catch(error => {
                dispatch(authFail());
            });
    }
};