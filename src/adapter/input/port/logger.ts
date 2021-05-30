interface LoggerFunction {
    <T>(obj: T, msg?: string): void;
}

interface Logger {
    info: LoggerFunction
    fatal: LoggerFunction
    error: LoggerFunction
    warn: LoggerFunction
    debug: LoggerFunction
    trace: LoggerFunction
    silent: LoggerFunction
}

export default Logger;
