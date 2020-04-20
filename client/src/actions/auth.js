import { 
  REGISTER_SUCCESS, 
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_FAILED,
  LOGIN_SUCCESS,
  LOGOUT,
  CLEAR_PROFILE
} from './types';

import axios from 'axios';
import { setAlert } from './alert';
import setAuthToken from '../utils/setAuthToken';


export const loadUser = () => async dispatch => {
  if (localStorage.token) {
    console.log('.....localStorage.totken');
    setAuthToken(localStorage.token);
  }
  
  try {
    const res = await axios.get('/api/auth');
    dispatch ({
      type: USER_LOADED,
      payload: res.data
    })
  } catch (error) {
    dispatch({
      type: AUTH_ERROR
    })
  }
};

export const login = ( email, password ) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }
  const body = JSON.stringify({ email, password });

  try {
    const res = await axios.post('/api/auth', body, config);

    console.log('user in action ', res.data)
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data
    });
    dispatch({
      type: USER_LOADED
    });

  } catch(error) {
    // const errors = error.response.data.errors;
    // errors.forEach(error => dispatch (setAlert(error.msg, 'danger')));

    dispatch({
      type: LOGIN_FAILED
    });
    dispatch({
      type: CLEAR_PROFILE
    })
  }
};

export const register = ({ name, email, password }) =>  async dispatch => {

  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }

  const body = JSON.stringify({ name, email, password });
  try {
    const res = await axios.post('/api/users', body, config);

    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data
    })
    dispatch({
      type: USER_LOADED
    });
  } catch (error) {
    const errors = error.response.data.errors;

    if(errors) {
      errors.forEach(error => dispatch( setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: REGISTER_FAIL
    });
  }
}

export const logout = () => dispatch => {
  dispatch ({
    type: LOGOUT
  });
  dispatch ({
    type: CLEAR_PROFILE
  });
}
