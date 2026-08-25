import { useToast } from "./GlobalToast";

export const handleApiError = (error, toast) => {
  console.error("API Error:", error);

  let message = "An unexpected error occurred. Please try again.";

  if (error?.response) {
    // Server responded with error status
    const status = error.response.status;
    const data = error.response.data;

    switch (status) {
      case 400:
        message = data?.message || "Invalid request. Please check your input.";
        break;
      case 401:
        message = "Unauthorized. Please log in again.";
        break;
      case 403:
        message = "Access denied. You don't have permission to perform this action.";
        break;
      case 404:
        message = "Resource not found.";
        break;
      case 409:
        message = data?.message || "Conflict. This resource already exists.";
        break;
      case 422:
        message = data?.message || "Validation error. Please check your input.";
        break;
      case 429:
        message = "Too many requests. Please wait and try again.";
        break;
      case 500:
        message = "Server error. Please try again later.";
        break;
      default:
        message = data?.message || `Server error (${status}). Please try again.`;
    }
  } else if (error?.request) {
    // Request made but no response received
    message = "Network error. Please check your connection.";
  } else if (error?.message) {
    // Error in setting up the request
    message = error.message;
  }

  if (toast) {
    toast.error(message);
  }

  return message;
};

export const handleValidationError = (errors, toast) => {
  console.error("Validation Error:", errors);

  let message = "Please fix the following errors:";

  if (Array.isArray(errors)) {
    message = errors.join(", ");
  } else if (typeof errors === "object") {
    const errorMessages = Object.values(errors).flat();
    message = errorMessages.join(", ");
  } else if (typeof errors === "string") {
    message = errors;
  }

  if (toast) {
    toast.error(message);
  }

  return message;
};

export const handleNetworkError = (error, toast) => {
  console.error("Network Error:", error);

  const message = error?.message || "Network error. Please check your internet connection.";

  if (toast) {
    toast.error(message);
  }

  return message;
};

export const createErrorHandler = (toast) => {
  return {
    api: (error) => handleApiError(error, toast),
    validation: (errors) => handleValidationError(errors, toast),
    network: (error) => handleNetworkError(error, toast),
  };
};

export default {
  handleApiError,
  handleValidationError,
  handleNetworkError,
  createErrorHandler,
};
