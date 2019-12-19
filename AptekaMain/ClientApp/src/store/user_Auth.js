import axios from 'axios';
const UserLoginType = 'USER_LOGIN';
const UserLogoutType = 'USER_LOGOUT';
const initialState = { user: '', isLoading: false, isAuthenticated: false };

export const actionCreators = {
    loginUser: req => async (dispatch, getState) => {

        axios.post('/api/UserSessions', req).then(res => {
            dispatch({ type: UserLoginType, res });
        });

    },
    logoutUser: () => ({ type: UserLogoutType })
};

export const reducer = (state, action) => {
    state = state || initialState;
    if (action.type === UserLogoutType) {
        return {
            ...state,
            user: '',
            isLoading: false,
            isAuthenticated: false
        };
    }

    if (action.type === UserLoginType) {
        return {
            ...state,
            user: action.res.data,
            isLoading: false,
            isAuthenticated: true
        };
    }

    return state;
};
