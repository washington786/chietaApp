import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import type { SerializedError } from '@reduxjs/toolkit'

export type ApiErrorInfo = {
    message: string
    details?: string
    status?: number | string
}

const DEFAULT_MESSAGE = 'The service is temporarily unavailable.'

export const extractApiError = (error: unknown): ApiErrorInfo => {
    if (isFetchBaseQueryError(error)) {
        const status = error.status
        const data = error.data as any

        if (data?.error) {
            return {
                message: data.error.message ?? DEFAULT_MESSAGE,
                details: data.error.details,
                status,
            }
        }

        if (typeof data === 'string') {
            return { message: data, status }
        }

        if (data?.message) {
            return { message: data.message, details: data.details, status }
        }

        return {
            message: DEFAULT_MESSAGE,
            status,
        }
    }

    if (isSerializedError(error)) {
        const message = error.message || DEFAULT_MESSAGE
        return {
            message,
            details: error.stack,
            status: error.code,
        }
    }

    if (error instanceof Error) {
        return {
            message: error.message,
            details: error.stack,
        }
    }

    return {
        message: DEFAULT_MESSAGE,
    }
}

const isFetchBaseQueryError = (error: unknown): error is FetchBaseQueryError => {
    return typeof error === 'object' && error !== null && 'status' in error
}

const isSerializedError = (error: unknown): error is SerializedError => {
    return typeof error === 'object' && error !== null && 'message' in error && 'name' in error
}

export const formatApiErrorMessage = (info: ApiErrorInfo): string => {
    return info.details ?? info.message ?? DEFAULT_MESSAGE
}
