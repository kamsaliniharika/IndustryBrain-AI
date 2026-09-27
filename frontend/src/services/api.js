const API_BASE_URL = "https://industrybrain-ai.onrender.com";

const getAuthHeaders = () => {
  const token = localStorage.getItem("industrybrain_token");

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
};

// -----------------------------
// Clear Authentication Data
// -----------------------------
const clearAuthData = () => {
  localStorage.removeItem("industrybrain_token");
  localStorage.removeItem("industrybrain_logged_in");
  localStorage.removeItem("industrybrain_user_email");
  localStorage.removeItem("industrybrain_user_name");
  localStorage.removeItem("industrybrain_filename");
};

// -----------------------------
// Common Response Handler
// -----------------------------
const handleResponse = async (
  response,
  defaultMessage,
  redirectOnUnauthorized = true
) => {
  let data = {};

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  // Unauthorized / expired / invalid token
  if (response.status === 401 && redirectOnUnauthorized) {
    clearAuthData();

    if (window.location.pathname !== "/login") {
      window.location.href = "/login";
    }

    throw new Error(
      data.error || "Your session has expired. Please login again."
    );
  }

  if (!response.ok) {
    throw new Error(data.error || defaultMessage);
  }

  return data;
};

// -----------------------------
// Backend Health
// -----------------------------
export const checkBackend = async () => {
  const response = await fetch(`${API_BASE_URL}/health`);

  return handleResponse(
    response,
    "Backend connection failed",
    false
  );
};

// -----------------------------
// Authentication
// -----------------------------
export const signupUser = async (name, email, password) => {
  const response = await fetch(`${API_BASE_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: name.trim(),
      email: email.trim(),
      password,
    }),
  });

  return handleResponse(
    response,
    "Account creation failed",
    false
  );
};

export const loginUser = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email.trim(),
      password,
    }),
  });

  return handleResponse(
    response,
    "Login failed",
    false
  );
};

export const getCurrentUser = async () => {
  const response = await fetch(`${API_BASE_URL}/me`, {
    method: "GET",
    headers: {
      ...getAuthHeaders(),
    },
  });

  return handleResponse(
    response,
    "Failed to load user"
  );
};

export const logoutUser = async () => {
  const response = await fetch(`${API_BASE_URL}/logout`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
    },
  });

  return handleResponse(
    response,
    "Logout failed"
  );
};

// -----------------------------
// Document Upload
// -----------------------------
export const uploadDocument = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
    },
    body: formData,
  });

  return handleResponse(
    response,
    "File upload failed"
  );
};

// -----------------------------
// Document Extraction
// -----------------------------
export const extractDocument = async (filename) => {
  const response = await fetch(
    `${API_BASE_URL}/extract/${encodeURIComponent(filename)}`,
    {
      method: "GET",
      headers: {
        ...getAuthHeaders(),
      },
    }
  );

  return handleResponse(
    response,
    "Document extraction failed"
  );
};

// -----------------------------
// Document Indexing
// -----------------------------
export const indexDocument = async (filename) => {
  const response = await fetch(
    `${API_BASE_URL}/index/${encodeURIComponent(filename)}`,
    {
      method: "POST",
      headers: {
        ...getAuthHeaders(),
      },
    }
  );

  return handleResponse(
    response,
    "Document indexing failed"
  );
};

// -----------------------------
// Semantic Search
// -----------------------------
export const semanticSearch = async (query, filename) => {
  const response = await fetch(`${API_BASE_URL}/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({
      query,
      filename,
    }),
  });

  return handleResponse(
    response,
    "Semantic search failed"
  );
};

// -----------------------------
// Gemini AI Answer
// -----------------------------
export const askGemini = async (query, filename) => {
  const response = await fetch(`${API_BASE_URL}/ask`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({
      query,
      filename,
    }),
  });

  return handleResponse(
    response,
    "AI answer generation failed"
  );
};

// -----------------------------
// Get Documents
// -----------------------------
export const getDocuments = async () => {
  const response = await fetch(`${API_BASE_URL}/documents`, {
    method: "GET",
    headers: {
      ...getAuthHeaders(),
    },
  });

  return handleResponse(
    response,
    "Failed to load documents"
  );
};

// -----------------------------
// Delete Document
// -----------------------------
export const deleteDocument = async (filename) => {
  const response = await fetch(
    `${API_BASE_URL}/documents/${encodeURIComponent(filename)}`,
    {
      method: "DELETE",
      headers: {
        ...getAuthHeaders(),
      },
    }
  );

  return handleResponse(
    response,
    "Document deletion failed"
  );
};