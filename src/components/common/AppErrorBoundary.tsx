import React from 'react'

import { logger } from '@/utils/logger'

type FallbackRender = (params: { error: Error; reset: () => void }) => React.ReactNode

type Props = {
    children: React.ReactNode
    fallback: FallbackRender
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void
    onReset?: () => void
}

type State = {
    hasError: boolean
    error?: Error
}

class AppErrorBoundary extends React.Component<Props, State> {
    state: State = {
        hasError: false,
        error: undefined,
    }

    static getDerivedStateFromError(error: Error): State {
        return {
            hasError: true,
            error,
        }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        logger.error('AppErrorBoundary captured an error', error, {
            componentStack: errorInfo.componentStack,
        })
        this.props.onError?.(error, errorInfo)
    }

    private resetBoundary = () => {
        this.setState({ hasError: false, error: undefined })
        this.props.onReset?.()
    }

    render() {
        const { hasError, error } = this.state
        if (hasError && error) {
            return this.props.fallback({
                error,
                reset: this.resetBoundary,
            })
        }

        return this.props.children
    }
}

export default AppErrorBoundary
