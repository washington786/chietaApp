import { describe, expect, it, vi } from 'vitest'

import {
    createProjectSubmissionHandler,
    __TESTING__,
} from '../helpers/projectSubmissionHandler'

type HandlerDeps = Parameters<typeof createProjectSubmissionHandler>[0]

const buildDeps = (overrides: Partial<HandlerDeps> = {}): HandlerDeps => {
    const deps: HandlerDeps = {
        hasSignedApplication: () => true,
        validateProjectSubmission: vi.fn(async () => ({ success: true, message: 'Validated' })),
        submitApplication: vi.fn(async () => ({ success: true, message: 'Submitted' })),
        refetchProjectDetails: vi.fn(async () => undefined),
        setHasSubmitted: vi.fn(),
        showToast: vi.fn(),
    }

    return {
        ...deps,
        ...overrides,
    }
}

describe('createProjectSubmissionHandler', () => {
    it('prevents submission when signed application is missing', async () => {
        const deps = buildDeps({
            hasSignedApplication: () => false,
        })

        const handler = createProjectSubmissionHandler(deps)
        const result = await handler()

        expect(result).toEqual({
            success: false,
            message: __TESTING__.SIGNED_FORM_MESSAGE,
        })
        expect(deps.showToast).toHaveBeenCalledWith(
            expect.objectContaining({ message: __TESTING__.SIGNED_FORM_MESSAGE })
        )
        expect(deps.validateProjectSubmission).not.toHaveBeenCalled()
    })

    it('stops submission when validation fails and surfaces the message', async () => {
        const validationMessage = 'Missing required documents'
        const deps = buildDeps({
            validateProjectSubmission: vi.fn(async () => ({
                success: false,
                message: validationMessage,
            })),
        })

        const handler = createProjectSubmissionHandler(deps)
        const result = await handler()

        expect(result).toEqual({
            success: false,
            message: validationMessage,
        })
        expect(deps.submitApplication).not.toHaveBeenCalled()
        expect(deps.showToast).toHaveBeenCalledWith(
            expect.objectContaining({ message: validationMessage, type: 'error' })
        )
    })

    it('submits successfully when validation passes', async () => {
        const submitMessage = 'Application submitted'
        const refetch = vi.fn(async () => undefined)
        const deps = buildDeps({
            submitApplication: vi.fn(async () => ({ success: true, message: submitMessage })),
            refetchProjectDetails: refetch,
        })

        const handler = createProjectSubmissionHandler(deps)
        const result = await handler()

        expect(result).toEqual({
            success: true,
            message: submitMessage,
        })
        expect(deps.showToast).toHaveBeenCalledWith(
            expect.objectContaining({ message: submitMessage, type: 'success' })
        )
        expect(deps.setHasSubmitted).toHaveBeenCalledWith(true)
        expect(refetch).toHaveBeenCalledTimes(1)
    })

    it('reports submission failures from the backend', async () => {
        const deps = buildDeps({
            submitApplication: vi.fn(async () => {
                throw { data: { error: { message: 'Server unavailable' } } }
            }),
        })

        const handler = createProjectSubmissionHandler(deps)
        const result = await handler()

        expect(result).toEqual({
            success: false,
            message: 'Server unavailable',
        })
        expect(deps.showToast).toHaveBeenCalledWith(
            expect.objectContaining({ message: 'Server unavailable', type: 'error' })
        )
        expect(deps.setHasSubmitted).not.toHaveBeenCalled()
    })
})
