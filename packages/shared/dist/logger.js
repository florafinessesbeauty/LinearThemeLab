function log(level, message, meta) {
    const payload = {
        level,
        message,
        meta,
        timestamp: new Date().toISOString()
    };
    // Simple JSON logger – can be wired to Logtail/Sentry later
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(payload));
}
export const logger = {
    debug: (message, meta) => log("debug", message, meta),
    info: (message, meta) => log("info", message, meta),
    warn: (message, meta) => log("warn", message, meta),
    error: (message, meta) => log("error", message, meta)
};
