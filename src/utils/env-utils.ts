export abstract class EnvUtils {
  /**
   * Reads an environment variable as a string and throws if not found.
   * @param key The environment variable key.
   * @returns The environment variable value.
   */
  public static getString(key: string): string {
    const value = process.env[key];
    if (!value) {
      throw new Error(`Environment variable ${key} is not set.`);
    }
    return value;
  }

  /**
   * Reads an environment variable as a boolean.
   * @param key The environment variable key.
   * @returns The environment variable value converted to boolean.
   */
  public static getBoolean(key: string): boolean {
    const value = this.getString(key).toLowerCase();
    return value === 'true' || value === 'yes' || value === '1';
  }

  /**
   * Reads an environment variable as a number and throws if not a number.
   * @param key The environment variable key.
   * @returns The environment variable value converted to number.
   */
  public static getNumber(key: string): number {
    const value = this.getString(key);
    const number = Number(value);
    if (isNaN(number)) {
      throw new Error(`Environment variable ${key} is not a valid number.`);
    }
    return number;
  }
}
