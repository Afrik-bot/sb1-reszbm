type LogLevel = 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
}

class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  log(level: LogLevel, message: string, data?: any) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data
    };

    this.logs.push(entry);
    
    // In development, also log to console
    if (import.meta.env.DEV) {
      console[level](message, data);
    }

    // In production, we would send to a logging service
    if (import.meta.env.PROD) {
      this.persistLog(entry);
    }
  }

  private async persistLog(entry: LogEntry) {
    // TODO: Implement log persistence (e.g., to a logging service)
    // For now, we'll store in localStorage for demo purposes
    const logs = JSON.parse(localStorage.getItem('app_logs') || '[]');
    logs.push(entry);
    localStorage.setItem('app_logs', JSON.stringify(logs.slice(-1000))); // Keep last 1000 logs
  }

  getLogs(): LogEntry[] {
    return this.logs;
  }
}