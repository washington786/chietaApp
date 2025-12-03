import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState } from '../store'

export const api = createApi({
    reducerPath: 'api',
    tagTypes: ['Grant', 'Document', 'Organization', 'User'],

    baseQuery: fetchBaseQuery({
        baseUrl: 'https://api.chieta.org.za/v1',
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.token

            if (token) {
                headers.set('Authorization', `Bearer ${token}`)
            }

            headers.set('Accept', 'application/json')
            headers.set('Content-Type', 'application/json')

            return headers
        },
    }),

    endpoints: (builder) => ({
        getGrants: builder.query({
            query: () => '/grants',
            providesTags: ['Grant'],
        }),
        getOrganization: builder.query({
            query: (levyNumber) => `/org/${levyNumber}`,
            providesTags: ['Organization'],
        }),
        uploadDocument: builder.mutation({
            query: ({ file, type }) => ({
                url: '/documents',
                method: 'POST',
                body: file,
            }),
            invalidatesTags: ['Document'],
        }),
    }),
})

export const {
    useGetGrantsQuery,
    useGetOrganizationQuery,
    useUploadDocumentMutation,
} = api