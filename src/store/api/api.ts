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
        getUserOrganizations: builder.query({
            query: (userId: string) => `/api/services/app/Organisation/GetSdfLinked?userid=${userId}`,
            providesTags: ['Organization'],
        }),
        getOrganizationByProject: builder.query({
            query: (projectId) =>
                `/api/services/app/Organisation/GetByProject?id=${projectId}`,
            providesTags: ['Organization'],
        }),
        getOrganizationById: builder.query({
            query: (organisationId) =>
                `/api/services/app/Organisation/Get?id=${organisationId}`,
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
        uploadProjectDocument: builder.mutation({
            query: ({ file, docType, userId, appId }) => {
                const formData = new FormData();

                // Handle React Native file object from expo-document-picker
                formData.append('file', {
                    uri: file.uri,
                    name: file.name,
                    type: file.mimeType || 'application/octet-stream'
                } as any);

                const url = `/api/upload?DocType=${encodeURIComponent(docType)}&UserID=${userId}&module=Projects&appid=${appId}`;

                console.log('Upload URL:', url);
                console.log('Upload file:', { name: file.name, mimeType: file.mimeType, uri: file.uri });

                return {
                    url,
                    method: 'POST',
                    body: formData,
                };
            },
            invalidatesTags: ['Document'],
        }),
        downloadDocument: builder.mutation({
            query: (params: { docType: string; userID: number; module: string; appid: number }) => ({
                url: `/api/download?DocType=${encodeURIComponent(params.docType)}&UserID=${params.userID}&module=${params.module}&appid=${params.appid}`,
                method: 'GET',
            }),
        }),
        delinkOrganization: builder.mutation({
            query: (params: { id: number; userid: number }) => ({
                url: `/api/services/app/Organisation/DeLinkSDF?id=${params.id}&userid=${params.userid}`,
                method: 'GET',
            }),
            invalidatesTags: ['Organization'],
        }),
        linkOrganization: builder.mutation({
            query: (payload: {
                organisationId: number;
                sdfId: number;
                userId: number;
                personId: number;
                statusId: number;
                statusDate: string;
                dateCreated: string;
            }) => ({
                url: '/api/services/app/Sdf/LinkOrganisation',
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: ['Organization'],
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

        /**
         * Discretionary Grants Endpoints
         */
        getActiveWindowsParams: builder.query({
            query: () => '/api/services/app/DiscretionaryWindow/GetActiveWindowsParams',
            providesTags: ['Grant'],
        }),
        createEditApplication: builder.mutation({
            query: (payload) => ({
                url: '/api/services/app/DiscretionaryProject/CreateEditApplication',
                method: 'POST',
                body: payload,
                headers: {
                    'Content-Type': 'application/json',
                },
            }),
            invalidatesTags: ['Grant'],
        }),
        deleteApplication: builder.mutation({
            query: ({ id, userId }) => ({
                url: `/api/services/app/DiscretionaryProject/DeleteApplication?id=${id}&userid=${userId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Grant'],
        }),
        createEditApplicationDetails: builder.mutation({
            query: (payload) => ({
                url: '/api/services/app/DiscretionaryProject/CreateEditApplicationDetails',
                method: 'POST',
                body: payload,
                headers: {
                    'Content-Type': 'application/json',
                },
            }),
            invalidatesTags: ['Grant'],
        }),
        getOrgProjects: builder.query({
            query: (organisationId) =>
                `/api/services/app/DiscretionaryProject/GetOrgProjects?OrganisationId=${organisationId}`,
            transformResponse: (response: any) => {
                if (response?.result?.items) {
                    const items = response.result.items.map((item: any) => {
                        return item.discretionaryProject || item;
                    });
                    return {
                        ...response.result,
                        items
                    };
                }
                return response?.result || response;
            },
            providesTags: ['Grant'],
        }),
        getWinFocusArea: builder.query({
            query: () => '/api/services/app/DiscretionaryWindow/GetWinFocusArea',
            providesTags: ['Grant'],
        }),
        getWinAdminCrit: builder.query({
            query: () => '/api/services/app/DiscretionaryWindow/GetWinAdminCrit',
            providesTags: ['Grant'],
        }),
        getEvalMeth: builder.query({
            query: () => '/api/services/app/DiscretionaryWindow/GetEvalMeth',
            providesTags: ['Grant'],
        }),
        getProjectType: builder.query({
            query: () => '/api/services/app/DiscretionaryWindow/GetProjectType',
            transformResponse: (response: any) => response?.result?.items || response?.result || response,
            providesTags: ['Grant'],
        }),
        getFocusArea: builder.query({
            query: (projType) =>
                `/api/services/app/DiscretionaryWindow/GetFocusArea?projType=${projType}`,
            transformResponse: (response: any) => response?.result?.items || response?.result || response,
            providesTags: ['Grant'],
        }),
        getAdminCrit: builder.query({
            query: ({ projType, focusId }) =>
                `/api/services/app/DiscretionaryWindow/GetAdminCrit?projType=${projType}&focusId=${focusId}`,
            transformResponse: (response: any) => response?.result?.items || response?.result || response,
            providesTags: ['Grant'],
        }),
        getEvalMethods: builder.query({
            query: ({ projType, focusId, critId }) =>
                `/api/services/app/DiscretionaryWindow/GetEvalMeth?projType=${projType}&focusId=${focusId}&critId=${critId}`,
            transformResponse: (response: any) => response?.result?.items || response?.result || response,
            providesTags: ['Grant'],
        }),
        getDGProjectDetById: builder.query({
            query: (projectId) =>
                `/api/services/app/DiscretionaryProject/GetDGProjectDetById?ProjectId=${projectId}`,
            providesTags: ['Grant'],
        }),
        getProjectDetails: builder.query({
            query: (projectId) =>
                `/api/services/app/DiscretionaryProject/GetProjectDetails?ProjectId=${projectId}`,
            providesTags: ['Grant'],
        }),
        getDGProjectDetailsApp: builder.query({
            query: (projectId) =>
                `/api/services/app/DiscretionaryProject/GetDGProjectDetailsApp?ProjectId=${projectId}`,
            providesTags: ['Grant'],
        }),
        getDGOrgApplications: builder.query({
            query: (organisationId) =>
                `/api/services/app/DiscretionaryProjectApproval/GetOrgProjects?OrganisationId=${organisationId}`,
            transformResponse: (response: any) => {
                let items: any[] = [];

                // Handle direct array response
                if (Array.isArray(response)) {
                    items = response;
                }
                // Handle response with result.items
                else if (response?.result?.items) {
                    items = response.result.items;
                }
                // Handle response where result is an array
                else if (response?.result && Array.isArray(response.result)) {
                    items = response.result;
                }
                // Handle array of items wrapped in discretionaryProject
                else if (Array.isArray(response)) {
                    items = response;
                }

                // Extract actual project data from discretionaryProject wrapper if needed
                const processedItems = items.map((item: any) => {
                    // If item has discretionaryProject property, extract it
                    if (item?.discretionaryProject && typeof item.discretionaryProject === 'object') {
                        return item.discretionaryProject;
                    }
                    // Otherwise return item as-is
                    return item;
                });

                // Filter out items with null or empty focusArea
                const filteredItems = processedItems.filter((item: any) =>
                    item.focusArea !== null &&
                    item.focusArea !== undefined &&
                    item.focusArea !== '' &&
                    item.focusArea.toString().trim().length > 0
                );

                return { result: { items: filteredItems, totalCount: filteredItems.length } };
            },
            providesTags: ['Grant'],
        }),

        /**
         * Mandatory Grants Endpoints
         */
        getOrgApplications: builder.query({
            query: (organisationId) =>
                `/api/services/app/MandatoryGrants/GetOrgApplications?Organisationid=${organisationId}`,
            transformResponse: (response: any) => {
                if (response?.result?.items) {
                    const items = response.result.items.map((item: any) => {
                        return item.mandatoryApplication || item;
                    });
                    return {
                        ...response.result,
                        items
                    };
                }
                return response?.result || response;
            },
            providesTags: ['Grant'],
        }),
        getMandatoryGrantPayments: builder.query({
            query: (sdl) =>
                `/api/services/app/MandatoryGrantPayments/GetMandatoryGrantPayments?sdl=${sdl}`,
            transformResponse: (response: any) => {
                if (response?.result?.items) {
                    const items = response.result.items.map((item: any) => {
                        // Extract payment data if it's wrapped
                        return item.mandatoryGrantsPayments || item;
                    });
                    return {
                        ...response.result,
                        items,
                    };
                }
                return response?.result || response;
            },
            providesTags: ['Grant'],
        }),
        getApplicationBios: builder.query({
            query: (applicationId) =>
                `/api/services/app/MandatoryGrants/GetApplicationBios_?applicationId=${applicationId}`,
            transformResponse: (response: any) => {
                if (response?.result?.items) {
                    const items = response.result.items.map((item: any) => {
                        // Extract biodata if it's wrapped
                        return item.biodata || item;
                    });
                    return {
                        ...response.result,
                        items
                    };
                }
                return response?.result || response;
            },
            providesTags: ['Grant'],
        }),

        /**
         * Person/User Endpoints
         */
        getPersonByUserId: builder.query({
            query: (userId) =>
                `/api/services/app/Person/GetPersonByUserId?userid=${userId}`,
            providesTags: ['User'],
        }),
        getPersonById: builder.query({
            query: (id) =>
                `/api/services/app/Person/Get?id=${id}`,
            providesTags: ['User'],
        }),
        getSDFByUser: builder.query({
            query: (userId) =>
                `/api/services/app/Sdf/GetSDFByUser?userId=${userId}`,
            transformResponse: (response: any) => response?.result?.sdfDetails || response?.result || response,
            providesTags: ['User'],
        }),

        /**
         * Province/District Endpoints
         */
        getProvinceDistricts: builder.query({
            query: () => '/api/services/app/ProvinceDistrict/ProvinceDistricts',
        }),
        getProvinceMunicipalities: builder.query({
            query: (provinceId) =>
                `/api/services/app/ProvinceMunicipality/ProvinceMunicipalities?provinceId=${provinceId}`,
        }),

        /**
         * Organization Bank Endpoints
         */
        getOrgBank: builder.query({
            query: (id) => `/api/services/app/Organisation/GetOrgBank?Id=${id}`,
            providesTags: ['Organization'],
        }),

        /**
         * Documents Endpoints
         */
        getDocumentsByEntity: builder.query({
            query: ({ entityId, module, documentType }) =>
                `/api/services/app/Documents/GetDocumentsByEntity?entityid=${entityId}&module=${module}&documenttype=${encodeURIComponent(documentType)}`,
            providesTags: ['Document'],
        }),

        /**
         * Organization SDF Endpoints
         */
        getOrgSdfByOrg: builder.query({
            query: ({ organisationId, userId }: { organisationId: number; userId: number }) =>
                `/api/services/app/Sdf/GetOrgSdfByOrg?Id=${organisationId}&userid=${userId}`,
            transformResponse: (response: any) => response?.result?.organisation_Sdf || response?.result || response,
            providesTags: ['Organization'],
        }),

        /**
         * Discretionary Project Submission Endpoints
         */
        validateProjSubmission: builder.mutation({
            query: (projId: number) => ({
                url: `/api/services/app/DiscretionaryProject/validateProjSubmission?projId=${projId}`,
                method: 'POST',
            }),
            transformResponse: (response: any) => ({
                message: response?.result,
                success: response?.success,
            }),
            invalidatesTags: ['Grant'],
        }),
    }),
})

export const {
    useGetAuthenticateUserQuery,
    useGetGrantsQuery,
    useGetOrganizationQuery,
    useGetOrganizationByTenantQuery,
    useGetUserOrganizationsQuery,
    useUploadDocumentMutation,
    useUploadProjectDocumentMutation,
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
    useGetActiveWindowsParamsQuery,
    useCreateEditApplicationMutation,
    useDeleteApplicationMutation,
    useCreateEditApplicationDetailsMutation,
    useDelinkOrganizationMutation,
    useLinkOrganizationMutation,
    useGetOrgProjectsQuery,
    useGetWinFocusAreaQuery,
    useGetWinAdminCritQuery,
    useGetEvalMethQuery,
    useGetProjectTypeQuery,
    useGetFocusAreaQuery,
    useGetAdminCritQuery,
    useGetEvalMethodsQuery,
    useGetDGProjectDetByIdQuery,
    useGetProjectDetailsQuery,
    useGetDGProjectDetailsAppQuery,
    useGetDGOrgApplicationsQuery,
    useGetOrgApplicationsQuery,
    useGetMandatoryGrantPaymentsQuery,
    useGetApplicationBiosQuery,
    useGetPersonByUserIdQuery,
    useGetSDFByUserQuery,
    useGetProvinceDistrictsQuery,
    useGetProvinceMunicipalitiesQuery,
    useGetOrgBankQuery,
    useGetPersonByIdQuery,
    useGetOrganizationByProjectQuery,
    useGetOrganizationByIdQuery,
    useGetDocumentsByEntityQuery,
    useGetOrgSdfByOrgQuery,
    useLazyGetOrgSdfByOrgQuery,
    useValidateProjSubmissionMutation,
} = api
