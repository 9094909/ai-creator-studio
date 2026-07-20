// Error handler utility
export interface AuthError {
  code: string;
  message: string;
}

export const getAuthErrorMessage = (error: any): string => {
  const errorCode = error?.code || error?.message || 'unknown_error';

  const errorMessages: Record<string, string> = {
    'auth/email-already-in-use': 'This email is already registered. Please log in instead.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/weak-password': 'Password is too weak. Please use a stronger password.',
    'auth/user-not-found': 'No account found with this email address.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/too-many-requests': 'Too many login attempts. Please try again later.',
    'auth/network-request-failed': 'Network error. Please check your connection.',
    'auth/operation-not-allowed': 'This operation is not allowed.',
    'auth/popup-closed-by-user': 'Sign in was cancelled.',
    'auth/popup-blocked': 'Sign in popup was blocked by your browser.',
    'auth/account-exists-with-different-credential': 'An account already exists with this email address.',
  };

  return errorMessages[errorCode] || 'An error occurred. Please try again.';
};
