export const getToday = (): string => {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

export const getEnvVar = (name: string): string => {
    const value = process.env[name];
    if (!value) {
        // Return empty string or throw error depending on strictness. 
        // For now, throwing error as per user code, but handling potential missing env in dev.
        if (process.env.NODE_ENV === 'development') {
            console.warn(`Env variable ${name} is not defined`);
            return '';
        }
        throw new Error(`Env variable ${name} is not defined`);
    }
    return value;
};
