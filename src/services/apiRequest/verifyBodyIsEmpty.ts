function verifyBodyIsEmpty(body: unknown) {
  if (body === "") {
    throw new Error("Request body cannot be empty");
  }
}

export { verifyBodyIsEmpty };
