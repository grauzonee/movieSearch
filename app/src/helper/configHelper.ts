export function getConfigValue(fieldName: string): string {
    const value = process.env[fieldName];
    if (value === undefined) {
        throw new Error(fieldName + " is not set in .env file!");
    }
    return value;
}
