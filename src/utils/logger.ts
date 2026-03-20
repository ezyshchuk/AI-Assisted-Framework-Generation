/**
 * Lightweight, CI-friendly typed logger with timestamps and log-level filtering.
 *
 * Log level is controlled via the LOG_LEVEL environment variable.
 * Accepted values: debug | info | warn | error  (default: info)
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LEVEL_ORDER: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

function resolveLevel(): LogLevel {
  const raw = (process.env['LOG_LEVEL'] ?? 'info').toLowerCase();
  if (raw in LEVEL_ORDER) return raw as LogLevel;
  return 'info';
}

const minLevel = resolveLevel();

function emit(level: LogLevel, message: string, meta?: unknown): void {
  if (LEVEL_ORDER[level] < LEVEL_ORDER[minLevel]) return;

  const timestamp = new Date().toISOString();
  const tag = `[${timestamp}] [${level.toUpperCase().padEnd(5)}]`;
  const suffix = meta !== undefined ? ` ${JSON.stringify(meta)}` : '';

  // eslint-disable-next-line no-console
  console.log(`${tag} ${message}${suffix}`);
}

export const logger = {
  debug: (message: string, meta?: unknown): void => emit('debug', message, meta),
  info: (message: string, meta?: unknown): void => emit('info', message, meta),
  warn: (message: string, meta?: unknown): void => emit('warn', message, meta),
  error: (message: string, meta?: unknown): void => emit('error', message, meta),
} as const;
