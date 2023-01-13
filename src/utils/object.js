// propertyPath: string[]
export const accessObjProperty = (object, propertyPath) => {
  if (propertyPath.length === 0) {
    return object;
  }

  const [firstProperty, ...remainingProperties] = propertyPath;

  return object[firstProperty] !== undefined
    ? accessObjProperty(object[firstProperty], remainingProperties)
    : undefined;
};

