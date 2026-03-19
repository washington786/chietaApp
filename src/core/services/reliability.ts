import { registerOfflineHandler, setupOfflineQueue } from '@/core/services/offlineQueue'
import { api } from '@/store/api/api'
import { store } from '@/store/store'
import { logger } from '@/utils/logger'

let reliabilityInitialized = false

export const initializeReliabilityLayer = async () => {
    if (reliabilityInitialized) {
        return
    }

    reliabilityInitialized = true

    registerOfflineHandler('notification', async (request) => {
        const payload = request.payload
        const action = store.dispatch(api.endpoints.createNotification.initiate(payload))
        const result = await action.unwrap()
        logger.info('Sent queued notification to backend', {
            requestId: request.id,
            response: result,
        })
    })

    try {
        await setupOfflineQueue()
    } catch (error) {
        logger.error('Failed to initialize offline queue', error as Error)
    }
}
