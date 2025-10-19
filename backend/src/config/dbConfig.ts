// Define the interface for the expected process.env structure
interface Env {
    NODE_ENV?: string;
    DB_LOCAL_URI?: string;
    DB_URI?: string;
    [key: string]: string | undefined; // Allow other env properties
}

/**
 * Determines the correct MongoDB URI based on the NODE_ENV.
 * * @returns {string} The database connection URI.
 * @throws {Error} If the environment variable or URI is missing.
 */
export const getDatabaseUri = (): string => {
    // Cast process.env to the defined Env interface for safety
    const env = process.env as Env;
    let DB_URI = "";

    if (env.NODE_ENV === 'DEV') {
        DB_URI = env.DB_LOCAL_URI || "";
    } else if (env.NODE_ENV === 'PROD') {
        DB_URI = env.DB_URI || "";
    } else {
        // Fallback or error if NODE_ENV is not set or unexpected
        throw new Error('NODE_ENV must be set to DEV or PROD.');
    }

    if (!DB_URI) {
        const varName = env.NODE_ENV === 'DEV' ? 'DB_LOCAL_URI' : 'DB_URI';
        throw new Error(`Database URI is missing for ${env.NODE_ENV} mode. Check ${varName}.`);
    }

    return DB_URI;
};