
export const emailValidator = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const requiredValidator = (value: unknown): boolean => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  if (value instanceof Date) {
    return !isNaN(value.getTime());
  }
  if (typeof value === 'number') {
    return !isNaN(value);
  }
  if (typeof value === 'object') {
    return value !== null && Object.keys(value as object).length > 0;
  }
  return value !== null && value !== undefined;
};

export const minLengthValidator = (value: string, minLength: number): boolean => {
  return value.length >= minLength;
};

export const maxLengthValidator = (value: string, maxLength: number): boolean => {
  return value.length <= maxLength;
};

export const numberValidator = (value: unknown): value is number => {
  return typeof value === 'number' && !isNaN(value);
};

export const dateValidator = (value: unknown): value is Date => {
  return value instanceof Date && !isNaN(value.getTime());
};