import dotenv from "dotenv";

dotenv.config();

interface envConfig {
  PORT: string;
  DB_URL: string;
  NODE_ENV: "Development" | "Production";
}

const loadEnvVariable = (): envConfig => {
  const requiredEnvVariable: string[] = ["PORT", "DB_URL", "NODE_ENV"];

  requiredEnvVariable.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`your key is not undefined ${key}`);
    }
  });
  return {
    PORT: process.env.PORT as string,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    DB_URL: process.env.DB_URL!,
    NODE_ENV: process.env.NODE_ENV as "Development" | "Production",
  };
};

export default loadEnvVariable();
