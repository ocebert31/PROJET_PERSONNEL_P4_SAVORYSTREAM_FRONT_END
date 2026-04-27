class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/** HTTP statuses commonly used for optimistic-lock / ETag version conflicts. */
export function isVersionConflictApiError(error: unknown): error is ApiError {
  return error instanceof ApiError && (error.status === 409 || error.status === 412);
}

export { ApiError };
