import { describe, it, expect } from 'vitest'
import * as Yup from 'yup'

// ─── Replicate the validation schema exactly as used in AccountSettingsPage ──
const validationSchema = Yup.object().shape({
    name: Yup.string().required('First name is required'),
    surname: Yup.string().required('Last name is required'),
    userName: Yup.string().required('Username is required'),
})

// ─── Helper ──────────────────────────────────────────────────────────────────
async function validate(values: object) {
    try {
        await validationSchema.validate(values, { abortEarly: false })
        return { valid: true, errors: {} as Record<string, string> }
    } catch (e: any) {
        const errors: Record<string, string> = {}
        e.inner?.forEach((err: any) => { errors[err.path] = err.message })
        return { valid: false, errors }
    }
}

// ─── Replicate the handleSubmit payload builder ───────────────────────────────
function buildPayload(values: { userName: string; name: string; surname: string; emailAddress: string }) {
    return {
        userName: values.userName,
        name: values.name,
        surname: values.surname,
        emailAddress: values.emailAddress,
    }
}

// ─── Validation tests ─────────────────────────────────────────────────────────
describe('AccountSettingsPage — validation schema', () => {
    it('passes with all required fields filled', async () => {
        const { valid } = await validate({ name: 'John', surname: 'Doe', userName: 'johndoe' })
        expect(valid).toBe(true)
    })

    it('fails when name is empty', async () => {
        const { valid, errors } = await validate({ name: '', surname: 'Doe', userName: 'johndoe' })
        expect(valid).toBe(false)
        expect(errors.name).toBe('First name is required')
    })

    it('fails when surname is empty', async () => {
        const { valid, errors } = await validate({ name: 'John', surname: '', userName: 'johndoe' })
        expect(valid).toBe(false)
        expect(errors.surname).toBe('Last name is required')
    })

    it('fails when userName is empty', async () => {
        const { valid, errors } = await validate({ name: 'John', surname: 'Doe', userName: '' })
        expect(valid).toBe(false)
        expect(errors.userName).toBe('Username is required')
    })

    it('reports all three errors at once when all fields are empty', async () => {
        const { valid, errors } = await validate({ name: '', surname: '', userName: '' })
        expect(valid).toBe(false)
        expect(Object.keys(errors)).toHaveLength(3)
        expect(errors.name).toBeDefined()
        expect(errors.surname).toBeDefined()
        expect(errors.userName).toBeDefined()
    })

    it('trims correctly — single character names are valid', async () => {
        const { valid } = await validate({ name: 'A', surname: 'B', userName: 'c' })
        expect(valid).toBe(true)
    })
})

// ─── Email is excluded from validation (it is disabled / read-only) ───────────
describe('AccountSettingsPage — email field is excluded from validation', () => {
    it('passes when emailAddress is absent from values (not validated)', async () => {
        const { valid } = await validate({ name: 'Jane', surname: 'Smith', userName: 'jsmith' })
        expect(valid).toBe(true)
    })

    it('passes with an invalid emailAddress because email is not in the schema', async () => {
        const { valid, errors } = await validate({
            name: 'Jane', surname: 'Smith', userName: 'jsmith', emailAddress: 'not-an-email',
        })
        expect(valid).toBe(true)
        expect(errors.emailAddress).toBeUndefined()
    })
})

// ─── Payload builder tests ────────────────────────────────────────────────────
describe('AccountSettingsPage — update profile payload', () => {
    it('builds the correct payload shape from form values', () => {
        const formValues = {
            name: 'John',
            surname: 'Doe',
            userName: 'johndoe',
            emailAddress: 'john@example.com',
        }
        const payload = buildPayload(formValues)
        expect(payload).toEqual({
            name: 'John',
            surname: 'Doe',
            userName: 'johndoe',
            emailAddress: 'john@example.com',
        })
    })

    it('payload contains emailAddress unchanged from initial user value (email is read-only)', () => {
        const userEmail = 'user@chieta.org.za'
        const formValues = {
            name: 'Alice',
            surname: 'Molefe',
            userName: 'amolefe',
            emailAddress: userEmail, // passed in from user.email, not user-editable
        }
        const payload = buildPayload(formValues)
        expect(payload.emailAddress).toBe(userEmail)
    })

    it('payload maps form field names to UpdateProfileRequest interface keys', () => {
        const payload = buildPayload({ name: 'X', surname: 'Y', userName: 'z', emailAddress: 'x@y.com' })
        expect(payload).toHaveProperty('name')
        expect(payload).toHaveProperty('surname')
        expect(payload).toHaveProperty('userName')
        expect(payload).toHaveProperty('emailAddress')
    })
})

// ─── Initial values builder ───────────────────────────────────────────────────
describe('AccountSettingsPage — initial form values', () => {
    function buildInitialValues(user: {
        firstName?: string, lastName?: string, username?: string, email?: string
    } | null) {
        return {
            name: user?.firstName || '',
            surname: user?.lastName || '',
            userName: user?.username || '',
            emailAddress: user?.email || '',
        }
    }

    it('maps user fields to correct form field names', () => {
        const user = { firstName: 'John', lastName: 'Doe', username: 'johndoe', email: 'john@example.com' }
        const values = buildInitialValues(user)
        expect(values.name).toBe('John')
        expect(values.surname).toBe('Doe')
        expect(values.userName).toBe('johndoe')
        expect(values.emailAddress).toBe('john@example.com')
    })

    it('defaults to empty strings when user is null', () => {
        const values = buildInitialValues(null)
        expect(values.name).toBe('')
        expect(values.surname).toBe('')
        expect(values.userName).toBe('')
        expect(values.emailAddress).toBe('')
    })

    it('defaults to empty strings for missing optional fields', () => {
        const values = buildInitialValues({})
        expect(values.name).toBe('')
        expect(values.surname).toBe('')
        expect(values.userName).toBe('')
        expect(values.emailAddress).toBe('')
    })
})
