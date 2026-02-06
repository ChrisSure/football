// TODO Move that helper in some common level
export const parseNumber = (value: string | undefined): number | undefined => {
  if (!value) {
    return undefined;
  }

  const parsed: number = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
};

export const parseBoolean = (value: string | undefined): boolean => {
  if (!value) {
    return false;
  }

  return value.toLowerCase() === 'true';
};

export const emptyToUndefined = (value: string | undefined): string | undefined => {
  if (!value) {
    return undefined;
  }

  return value;
};
