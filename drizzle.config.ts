import {Config} from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config({path: `.env.local`});

export default {
    driver: "pg",
    schema: './src/lib/db/schema.ts',
    dbCredentials:{
        connectionString: process.env.NEXT_PUBLIC_DB_URL!
    }
} satisfies Config