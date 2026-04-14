const DEFAULT_ERROR_MESSAGE = "Une erreur est survenue.";

function extractRailsErrors(errors: unknown): string | null {
  if (errors == null || typeof errors !== "object" || Array.isArray(errors)) {
    return null;
  }

  const parts: string[] = [];
  for (const [field, value] of Object.entries(errors as Record<string, unknown>)) {
    if (typeof value === "string" && value.trim()) {
      parts.push(`${field}: ${value.trim()}`);
      continue;
    }

    if (!Array.isArray(value)) {
      continue;
    }

    const messages = value
      .filter((entry): entry is string => typeof entry === "string")
      .map((message) => message.trim())
      .filter(Boolean);

    if (messages.length > 0) {
      parts.push(`${field}: ${messages.join(", ")}`);
    }
  }

  return parts.length > 0 ? parts.join(" · ") : null;
}

function messageFromBody(data: unknown, fallback: string): string {
  if (typeof data === "string") {
    return data.trim() || fallback;
  }

  if (data == null || typeof data !== "object") {
    return fallback;
  }

  const objectData = data as Record<string, unknown>;

  if (typeof objectData.message === "string" && objectData.message.trim()) {
    return objectData.message.trim();
  }

  if (typeof objectData.error === "string" && objectData.error.trim()) {
    return objectData.error.trim();
  }

  const validationMessage = extractRailsErrors(objectData.errors);
  return validationMessage || fallback;
}

async function errorMessageFromResponse(response: Response): Promise<string> {
  const fallback = response.statusText.trim() || DEFAULT_ERROR_MESSAGE;
  let raw = "";

  try {
    raw = await response.text();
  } catch {
    return fallback;
  }

  if (!raw.trim()) return fallback;

  try {
    const jsonBody = JSON.parse(raw) as unknown;
    return messageFromBody(jsonBody, fallback);
  } catch {
    return messageFromBody(raw, fallback);
  }
}

export { extractRailsErrors, messageFromBody, errorMessageFromResponse };
