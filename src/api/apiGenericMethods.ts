import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";
interface ErrorInterface {
  response?: object; // `response` is optional as it may not always be present
  message: string;
}

// Generic function for POST requests
export const postRequest = async <T>(
  endpoint: string,
  data?: object,
  token?: string
): Promise<T> => {
  try {
    // Directly return response.data
    const { data: responseData } = await axios.post<T>(
      `${BASE_URL}${endpoint}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return responseData;
  } catch (error: unknown) {
    const typedError = error as ErrorInterface; // Type assertion
    console.error(`Error in POST ${endpoint}:`, typedError.response || typedError.message);
    throw typedError; // Re-throw the error after processing
  }
};

// Generic function for GET requests
export const getRequest = async <T>(
  endpoint: string,
  token?: string,
  params?: object
): Promise<T> => {
  try {
    // Directly return response.data
    const { data: responseData } = await axios.get<T>(`${BASE_URL}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    });
    return responseData;
  } catch (error: unknown) {
    const typedError = error as ErrorInterface; // Type assertion
    console.error(`Error in POST ${endpoint}:`, typedError.response || typedError.message);
    throw typedError; // Re-throw the error after processing
  }
};

// Generic function for PUT requests
export const putRequest = async <T>(
  endpoint: string,
  token?: string
): Promise<T> => {
  try {
    // Directly return response.data
    const { data: responseData } = await axios.put<T>(
      `${BASE_URL}${endpoint}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return responseData;
  } catch (error: unknown) {
    const typedError = error as ErrorInterface; // Type assertion
    console.error(`Error in POST ${endpoint}:`, typedError.response || typedError.message);
    throw typedError; // Re-throw the error after processing
  }
};
