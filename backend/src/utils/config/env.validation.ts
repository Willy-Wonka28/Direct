import "dotenv/config";
export class EnvValidation {
  private static requiredEnvVars = [
    "DATABASE_URL",
    "REDIS_DATABASE_URL",
    "DIRECT_CLIENT_API_KEY",
    "JWT_SECRET_KEY",
    "CLIENT_URL",
    "NUBAPI_API_KEY",
  ];

  static validate(): void {
    for (const envVar of this.requiredEnvVars) {
      if (!process.env[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`);
      }
    }
  }

  static isDevelopment(): boolean {
    return process.env.NODE_ENV === "development";
  }

  static isProduction(): boolean {
    return process.env.NODE_ENV === "production";
  }
}
