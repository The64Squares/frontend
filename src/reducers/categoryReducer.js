import {
  ALL_CATEGORIES_REQUEST,
  ALL_CATEGORIES_SUCCESS,
  ALL_CATEGORIES_FAIL,
  NEW_CATEGORY_REQUEST,
  NEW_CATEGORY_SUCCESS,
  NEW_CATEGORY_RESET,
  NEW_CATEGORY_FAIL,
  DELETE_CATEGORY_REQUEST,
  DELETE_CATEGORY_SUCCESS,
  DELETE_CATEGORY_RESET,
  DELETE_CATEGORY_FAIL,
  CLEAR_ERRORS,
} from "../constants/categoryConstant";

export const categoriesReducer = (state = { categories: [] }, action) => {
  switch (action.type) {
    case ALL_CATEGORIES_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case ALL_CATEGORIES_SUCCESS:
      return {
        loading: false,
        categories: action.payload,
      };
    case ALL_CATEGORIES_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export const categoryOperationReducer = (state = {}, action) => {
  switch (action.type) {
    case NEW_CATEGORY_REQUEST:
    case DELETE_CATEGORY_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case NEW_CATEGORY_SUCCESS:
      return {
        loading: false,
        success: true,
        category: action.payload.category,
      };
    case DELETE_CATEGORY_SUCCESS:
      return {
        loading: false,
        isDeleted: action.payload,
      };
    case NEW_CATEGORY_FAIL:
    case DELETE_CATEGORY_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case NEW_CATEGORY_RESET:
      return {
        ...state,
        success: false,
      };
    case DELETE_CATEGORY_RESET:
      return {
        ...state,
        isDeleted: false,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};
