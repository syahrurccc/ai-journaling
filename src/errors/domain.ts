export class AuthenticationError extends Error {
  constructor() {
    super("Authentication failed");
    this.name = "AuthenticationError";
  }
}

export class EmailAlreadyRegisteredError extends Error {
  constructor() {
    super("Email is already registered");
    this.name = "EmailAlreadyRegisteredError";
  }
}

export class InvalidDateRangeError extends Error {
  constructor() {
    super("Invalid date range");
    this.name = "InvalidDateRangeError";
  }
}

export class JournalNotFoundError extends Error {
  constructor() {
    super("Journal not found");
    this.name = "JournalNotFoundError";
  }
}

export class UnauthorizedAccessError extends Error {
  constructor() {
    super("Unauthorized access");
    this.name = "UnauthorizedAccessError";
  }
}


