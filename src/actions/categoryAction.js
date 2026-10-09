import axios from "axios";
import {
  ALL_CATEGORIES_REQUEST,
  ALL_CATEGORIES_SUCCESS,
  ALL_CATEGORIES_FAIL,
  NEW_CATEGORY_REQUEST,
  NEW_CATEGORY_SUCCESS,
  NEW_CATEGORY_FAIL,
  DELETE_CATEGORY_REQUEST,
  DELETE_CATEGORY_SUCCESS,
  DELETE_CATEGORY_FAIL,
  CLEAR_ERRORS,
} from "../constants/categoryConstant";

// Get All Categories
export const getAllCategories = () => async (dispatch) => {
  try {
    dispatch({ type: ALL_CATEGORIES_REQUEST });
    const { data } = await axios.get("/api/v1/categories");
    dispatch({
      type: ALL_CATEGORIES_SUCCESS,
      payload: data.categories,
    });
  } catch (error) {
    dispatch({
      type: ALL_CATEGORIES_FAIL,
      payload:
        (error.response && error.response.data && error.response.data.message) ||
        error.message,
    });
  }
};

// Create New Category (Admin)
export const createCategory = (categoryData) => async (dispatch) => {
  try {
    dispatch({ type: NEW_CATEGORY_REQUEST });
    const config = {
      headers: { "Content-Type": "application/json" },
    };
    const { data } = await axios.post(
      "/api/v1/admin/category/new",
      categoryData,
      config
    );
    dispatch({
      type: NEW_CATEGORY_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: NEW_CATEGORY_FAIL,
      payload:
        (error.response && error.response.data && error.response.data.message) ||
        error.message,
    });
  }
};

// Delete Category (Admin)
export const deleteCategory = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_CATEGORY_REQUEST });
    const { data } = await axios.delete(`/api/v1/admin/category/${id}`);
    dispatch({
      type: DELETE_CATEGORY_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: DELETE_CATEGORY_FAIL,
      payload:
        (error.response && error.response.data && error.response.data.message) ||
        error.message,
    });
  }
};

// Clear Errors
export const clearErrors = () => async (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
