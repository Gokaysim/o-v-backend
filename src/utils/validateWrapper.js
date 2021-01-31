export default schema => rawInput => {
    const validationResult = schema.validate(rawInput);
    if (validationResult.error) {
        throw validationResult.error;
    }

    return validationResult.value;
};
