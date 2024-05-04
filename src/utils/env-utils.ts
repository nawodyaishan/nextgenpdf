import _ from 'lodash';

export abstract class EnvUtils {
  public static readBool(key: string): boolean {
    const rawValue = process.env[key];
    if (!rawValue) return false;
    if (rawValue?.toLowerCase()?.trim() === 'false') return false;
    if (rawValue?.toLowerCase()?.trim() === 'no') return false;
    if (rawValue?.toLowerCase()?.trim() === 'off') return false;
    return !!_.toNumber(rawValue);
  }

  public static readString(key: string): string {
    console.log('Fetching environment variable for key:', key, 'Value:', process.env[key]);
    return process.env[key] ?? '';
  }

  public static readNumber(key: string, ifNaN = 0): number {
    const raw = _.toNumber(process.env[key]);
    return _.isNaN(raw) ? ifNaN : raw;
  }
}
