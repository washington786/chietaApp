import { showToast } from '@/core'

type ToastFn = typeof showToast

type SubmissionResult = {
    success: boolean
    message?: string
}

type ProjectSubmissionDeps = {
    hasSignedApplication: () => boolean
    validateProjectSubmission: () => Promise<{ success: boolean; message?: string }>
    submitApplication: () => Promise<{ success?: boolean; message?: string }>
    refetchProjectDetails?: () => Promise<unknown>
    setHasSubmitted: (value: boolean) => void
    showToast: ToastFn
}

const SUBMISSION_SUCCESS_MESSAGE = 'The application has been submitted successfully.'
const SIGNED_FORM_MESSAGE = 'Please upload the signed application form'
const VALIDATION_FAILED_MESSAGE = 'Project submission validation failed.'
const SUBMISSION_FAILED_MESSAGE = 'Failed to submit application'

const extractErrorMessage = (error: unknown): string => {
    if (!error) {
        return SUBMISSION_FAILED_MESSAGE
    }

    if (typeof error === 'string') {
        return error
    }

    if (error instanceof Error) {
        return error.message
    }

    if (typeof error === 'object') {
        const maybeData = error as Record<string, any>
        return (
            maybeData?.data?.error?.message ||
            maybeData?.data?.message ||
            maybeData?.message ||
            SUBMISSION_FAILED_MESSAGE
        )
    }

    return SUBMISSION_FAILED_MESSAGE
}

export const createProjectSubmissionHandler = (
    deps: ProjectSubmissionDeps
): (() => Promise<SubmissionResult>) => {
    return async () => {
        if (!deps.hasSignedApplication()) {
            deps.showToast({
                message: SIGNED_FORM_MESSAGE,
                title: 'Submission',
                type: 'error',
                position: 'top',
            })
            return { success: false, message: SIGNED_FORM_MESSAGE }
        }

        try {
            const validationResult = await deps.validateProjectSubmission()
            if (!validationResult?.success) {
                const message = validationResult?.message || VALIDATION_FAILED_MESSAGE
                deps.showToast({
                    message,
                    title: 'Submission',
                    type: 'error',
                    position: 'top',
                })

                return { success: false, message }
            }

            const submitResult = await deps.submitApplication()
            const successMessage =
                submitResult?.message || validationResult?.message || SUBMISSION_SUCCESS_MESSAGE

            deps.showToast({
                message: successMessage,
                title: 'Success',
                type: 'success',
                position: 'top',
            })

            deps.setHasSubmitted(true)

            if (typeof deps.refetchProjectDetails === 'function') {
                try {
                    await deps.refetchProjectDetails()
                } catch (refetchError) {
                    console.warn('Failed to refetch project details after submission', refetchError)
                }
            }

            return { success: true, message: successMessage }
        } catch (error) {
            const message = extractErrorMessage(error)
            deps.showToast({
                message,
                title: 'Error',
                type: 'error',
                position: 'top',
            })

            return { success: false, message }
        }
    }
}

export const __TESTING__ = {
    extractErrorMessage,
    SIGNED_FORM_MESSAGE,
    SUBMISSION_SUCCESS_MESSAGE,
    VALIDATION_FAILED_MESSAGE,
    SUBMISSION_FAILED_MESSAGE,
}
