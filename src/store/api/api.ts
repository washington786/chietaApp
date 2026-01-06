import { createApi, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react'
import { RootState } from '../store'
import { refreshTokenThunk, logout } from '../slice/AuthSlice'

const baseQuery = fetchBaseQuery({
    baseUrl: 'https://ims.chieta.org.za:22743',
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.token

        if (token) {
            headers.set('Authorization', `Bearer ${token}`)
        }

        headers.set('Accept', 'application/json')
        headers.set('Content-Type', 'application/json')

        return headers
    },
})

/**
 * Base query with automatic token refresh on 401
 */
const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
    let result = await baseQuery(args, api, extraOptions)

    if (result.error && (result.error as FetchBaseQueryError).status === 401) {
        // Token expired, try to refresh
        const refreshResult = await api.dispatch(refreshTokenThunk())

        if (refreshResult.type === refreshTokenThunk.fulfilled.type) {
            // Retry original request with new token
            result = await baseQuery(args, api, extraOptions)
        } else {
            // Refresh failed, logout user
            api.dispatch(logout())
        }
    }

    return result
}

export const api = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Grant', 'Document', 'Organization', 'User', 'Auth'],

    endpoints: (builder) => ({
        /**
         * Authentication Endpoints
         */
        getAuthenticateUser: builder.query({
            query: () => '/api/services/app/Account/GetCurrentLoginInformations',
            providesTags: ['Auth'],
        }),

        /**
         * Grant Endpoints
         */
        getGrants: builder.query({
            query: () => '/grants',
            providesTags: ['Grant'],
        }),

        /**
         * Organization Endpoints
         */
        getOrganization: builder.query({
            query: (levyNumber) => `/org/${levyNumber}`,
            providesTags: ['Organization'],
        }),
        getOrganizationByTenant: builder.query({
            query: (tenantId) => `/api/services/app/Organisation/GetOrgDetailsbyTenant?tenantId=${tenantId}`,
            providesTags: ['Organization'],
        }),

        /**
         * Document Endpoints
         */
        uploadDocument: builder.mutation({
            query: ({ file, type }) => ({
                url: '/documents',
                method: 'POST',
                body: file,
            }),
            invalidatesTags: ['Document'],
        }),
        downloadDocument: builder.mutation({
            query: (documentId) => ({
                url: `/api/services/app/Account/DownloadFile?id=${documentId}`,
                method: 'GET',
            }),
        }),

        /**
         * Lookup Data Endpoints
         */
        getBanks: builder.query({
            query: () => '/api/services/app/Lookup/GetBanks',
            providesTags: ['Organization'],
        }),
        getProvinces: builder.query({
            query: () => '/api/services/app/Lookup/GetProvinces',
        }),
        getMunicipalities: builder.query({
            query: (provinceId) =>
                `/api/services/app/Lookup/GetMunicipalities?provinceId=${provinceId}`,
        }),
        getDistricts: builder.query({
            query: (provinceId) =>
                `/api/services/app/Lookup/GetDistricts?provinceId=${provinceId}`,
        }),
        getGenders: builder.query({
            query: () => '/api/services/app/Lookup/GetGenders',
        }),
        getIdTypes: builder.query({
            query: () => '/api/services/app/Lookup/GetIdTypes',
        }),
        getTitles: builder.query({
            query: () => '/api/services/app/Lookup/GetTitles',
        }),
        getNationalities: builder.query({
            query: () => '/api/services/app/Lookup/GetNationalities',
        }),
        getLanguages: builder.query({
            query: () => '/api/services/app/Lookup/GetLanguages',
        }),
        getEquity: builder.query({
            query: () => '/api/services/app/Lookup/GetEquity',
        }),
    }),
})

export const {
    useGetAuthenticateUserQuery,
    useGetGrantsQuery,
    useGetOrganizationQuery,
    useGetOrganizationByTenantQuery,
    useUploadDocumentMutation,
    useDownloadDocumentMutation,
    useGetBanksQuery,
    useGetProvincesQuery,
    useGetMunicipalitiesQuery,
    useGetDistrictsQuery,
    useGetGendersQuery,
    useGetIdTypesQuery,
    useGetTitlesQuery,
    useGetNationalitiesQuery,
    useGetLanguagesQuery,
    useGetEquityQuery,
} = api
