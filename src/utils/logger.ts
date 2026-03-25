type LogContext = Record<string, unknown> | undefined
type LogLevel = 'info' | 'warning' | 'error'

const LOG_ENDPOINT = process.env.EXPO_PUBLIC_LOG_ENDPOINT
const canSendRemoteLogs = typeof fetch === 'function' && Boolean(LOG_ENDPOINT)

const normalizeError = (error: unknown) => {
    if (error instanceof Error) {
        return {
            message: error.message,
            stack: error.stack,
            name: error.name,
        }
    }

    if (typeof error === 'string') {
        return { message: error }
    }

    if (typeof error === 'object' && error !== null) {
        return error
    }

    return undefined
}

const sendToCollector = async (
    level: LogLevel,
    message: string,
    context?: LogContext,
    error?: unknown
) => {
    if (!canSendRemoteLogs) {
        return
    }

    try {
        await fetch(LOG_ENDPOINT as string, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                level,
                message,
                context,
                error: normalizeError(error),
                timestamp: new Date().toISOString(),
            }),
        })
    } catch (collectorError) {
        if (typeof __DEV__ !== 'undefined' && __DEV__) {
            console.debug('[logger] Failed to reach log collector', collectorError)
        }
    }
}

export const logger = {
    info(message: string, context?: LogContext) {
        console.log(`[INFO] ${message}`, context ?? '')
        void sendToCollector('info', message, context)
    },
    warn(message: string, context?: LogContext) {
        console.warn(`[WARN] ${message}`, context ?? '')
        void sendToCollector('warning', message, context)
    },
    error(message: string, error?: unknown, context?: LogContext) {
        console.error(`[ERROR] ${message}`, error, context ?? '')
        void sendToCollector('error', message, context, error ?? message)
    },
}

export type Logger = typeof logger
