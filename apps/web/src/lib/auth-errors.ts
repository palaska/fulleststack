type AuthErrorCode = "EMAIL_NOT_VERIFIED" | "USER_ALREADY_EXISTS" | "INVALID_EMAIL_OR_PASSWORD";

type AuthErrorMessage = {
  title: string;
  description: string;
};

export function getAuthErrorMessage(code: AuthErrorCode): AuthErrorMessage {
  const errorMessages: Record<AuthErrorCode, AuthErrorMessage> = {
    EMAIL_NOT_VERIFIED: {
      title: "Verification Required",
      description: "Please verify your email before signing in.",
    },
    USER_ALREADY_EXISTS: {
      title: "Account Exists",
      description: "An account with this email already exists.",
    },
    INVALID_EMAIL_OR_PASSWORD: {
      title: "Invalid Credentials",
      description: "The email or password you entered is incorrect.",
    },
  };

  return errorMessages[code] ?? {
    title: "Authentication Error",
    description: "An unexpected error occurred. Please try again.",
  };
}
