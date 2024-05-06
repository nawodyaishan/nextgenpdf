export abstract class AppConfig {
  public static readonly neonDbUrl = process.env.NEXT_PUBLIC_DB_URL ?? '';
}
