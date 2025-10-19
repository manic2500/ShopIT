// src/types/env.d.ts

// Define the type alias for accepted expiresIn values
// This is often provided by the library's types, but defining it 
// helps in environments where those types are sometimes messy.
/* type JWTDuration = string | number;

declare namespace NodeJS {
    interface ProcessEnv {
        JWT_SECRET: string;
        // Tell TypeScript that this specific variable is a recognized duration
        JWT_EXPIRES_TIME: JWTDuration;
    }
} */