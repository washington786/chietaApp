import { createApi, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react'
import { RootState } from '../store'
import { refreshTokenThunk, logout } from '../slice/AuthSlice'
import { activeWindowBodyRequest, ProjectTimeline } from '@/core/models/DiscretionaryDto'
import { notificationPayload } from '@/core/types/notifications'

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
    tagTypes: ['Grant', 'Document', 'Organization', 'User', 'Auth', 'Notification'],

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
            transformResponse: (response: any) => {
                // Extract organization items from result.items[].organisation
                if (response?.result?.items && Array.isArray(response.result.items)) {
                    const organizations = response.result.items.map((item: any) => {
                        const org = item.organisation || item;
                        return {
                            organisationId: org?.id || org?.organisation_Id,
                            sdlNo: org?.sdL_No,
                            setaId: org?.setA_Id,
                            seta: org?.seta,
                            sicCode: org?.siC_Code,
                            organisationRegistrationNumber: org?.organisation_Registration_Number,
                            organisationName: org?.organisation_Name || org?.name,
                            organisationTradingName: org?.organisation_Trading_Name,
                            organisationFaxNumber: org?.organisation_Fax_Number,
                            organisationContactName: org?.organisation_Contact_Name,
                            organisationContactEmailAddress: org?.organisation_Contact_Email_Address,
                            organisationContactPhoneNumber: org?.organisation_Contact_Phone_Number,
                        };
                    });
                    return { items: organizations };
                }
                return { items: [] };
            },
            providesTags: ['Organization'],
        }),
        getOrganizationsBySdfId: builder.query({
            query: (sdfId: number) => {
                return `/api/services/app/Organisation/GetSdfLinked?sdfId=${sdfId}`;
            },
            transformResponse: (response: any) => {
                // Extract organization items from result.items[].organisation
                if (response?.result?.items && Array.isArray(response.result.items)) {
                    const organizations = response.result.items.map((item: any) => {
                        const org = item.organisation;
                        return {
                            sdlNo: org?.sdL_No,
                            setaId: org?.setA_Id,
                            seta: org?.seta,
                            sicCode: org?.siC_Code,
                            organisationRegistrationNumber: org?.organisation_Registration_Number,
                            organisationName: org?.organisation_Name,
                            organisationTradingName: org?.organisation_Trading_Name,
                            organisationFaxNumber: org?.organisation_Fax_Number,
                            organisationContactName: org?.organisation_Contact_Name,
                            organisationContactEmailAddress: org?.organisation_Contact_Email_Address,
                            organisationContactPhoneNumber: org?.organisation_Contact_Phone_Number,
                            organisationContactCellNumber: org?.organisation_Contact_Cell_Number,
                            companySize: org?.companY_SIZE,
                            numberOfEmployees: org?.numbeR_OF_EMPLOYEES,
                            typeOfEntity: org?.typE_OF_ENTITY,
                            coreBusiness: org?.corE_BUSINESS,
                            parentSdlNumber: org?.parenT_SDL_NUMBER,
                            bbbeeStatus: org?.bbbeE_Status,
                            bbbeeLevel: org?.bbbeE_LEVEL,
                            dateBusinessCommenced: org?.datebusinesscommenced,
                            status: org?.status,
                            exemptionCode: org?.exmptioncode,
                            chamber: org?.chamber,
                            ceoName: org?.ceO_Name,
                            ceoSurname: org?.ceO_Surname,
                            ceoEmail: org?.ceO_Email,
                            ceoRaceId: org?.ceO_RaceId,
                            ceoGenderId: org?.ceO_GenderId,
                            seniorRepName: org?.senior_Rep_Name,
                            seniorRepSurname: org?.senior_Rep_Surname,
                            seniorRepEmail: org?.senior_Rep_Email,
                            seniorRepRaceId: org?.senior_Rep_RaceId,
                            seniorRepGenderId: org?.senior_Rep_GenderId,
                            id: org?.id,
                        };
                    });
                    return organizations;
                }
                return [];
            },
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
        getOrganizationPhysicalAddress: builder.query({
            query: (organisationId) =>
                `/api/services/app/Organisation/GetOrganisationPhysAddress?organisationId=${organisationId}`,
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
                console.log('=== API UPLOAD MUTATION CALLED ===');
                console.log('Params received:', { docType, userId, appId });
                console.log('File object:', { name: file.name, mimeType: file.mimeType, uri: file.uri, size: file.size });

                // Extract file metadata
                const lastModifiedDate = new Date().toISOString();
                const type = file.mimeType || 'application/pdf';

                // Build request body matching backend expectations
                const body = {
                    entityid: appId,
                    module: 'Projects',
                    userId: userId,
                    documenttype: docType,
                    filename: file.name,
                    newfilename: file.name,
                    size: file.size || 0,
                    type: type,
                    lastmodifieddate: lastModifiedDate
                };

                const url = '/api/services/app/Documents/FileUpload';

                console.log('Upload URL:', url);
                console.log('Upload body:', body);

                return {
                    url,
                    method: 'POST',
                    body: body,
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
        getActiveWindows: builder.query({
            query: () => '/api/services/app/DiscretionaryWindow/GetActiveWindows',
            providesTags: ['Grant'],
        }),
        getActiveWindowsParams: builder.query({
            query: () => '/api/services/app/DiscretionaryWindow/GetActiveWindowsParams',
            providesTags: ['Grant'],
        }),
        createEditApplication: builder.mutation<any, activeWindowBodyRequest>({
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
        createNotification: builder.mutation<any, notificationPayload>({
            query: (payload) => ({
                url: '/api/services/app/Notification/CreateNotification',
                method: 'POST',
                body: payload,
                headers: {
                    'Content-Type': 'application/json',
                },
            }),
        }),
        getNotificationsByUser: builder.query<any, number>({
            query: (userId) =>
                `/api/services/app/Notification/GetByUser?userId=${userId}`,
            transformResponse: (response: any) => {
                if (response?.result) {
                    return {
                        items: response.result.map((item: any) => ({
                            id: String(item.id),
                            title: item.title,
                            body: item.message, // Backend returns 'message' not 'body'
                            data: {},
                            timestamp: new Date(item.createdAt).getTime(), // Backend uses 'createdAt'
                            read: item.isRead, // Backend returns 'isRead' not 'read'
                            source: item.source || 'system', // Default to 'system' if not provided
                        })),
                    };
                }
                return { items: [] };
            },
            providesTags: ['Notification'],
        }),
        markNotificationAsRead: builder.mutation<any, number>({
            query: (notificationId) => ({
                url: `/api/services/app/Notification/MarkAsRead?notificationId=${notificationId}`,
                method: 'POST',
            }),
            async onQueryStarted(notificationId, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    // Wait a moment then invalidate the notifications cache to force refetch
                    setTimeout(() => {
                        dispatch(api.util.invalidateTags(['Notification']));
                    }, 100);
                } catch (err) {
                    console.error('Failed to mark notification as read:', err);
                }
            },
        }),
        registerPushToken: builder.mutation<any, { userId: number; token: string }>({
            query: (payload) => ({
                url: '/api/services/app/User/RegisterPushToken',
                method: 'POST',
                body: {
                    userId: payload.userId,
                    pushToken: payload.token,
                },
                headers: {
                    'Content-Type': 'application/json',
                },
            }),
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
        getProjectTimeline: builder.query<{ items: ProjectTimeline[] }, number>({
            query: (organisationId) =>
                `/api/services/app/DiscretionaryProject/GetProjectTimeline?OrganisationId=${organisationId}`,
            transformResponse: (response: any) => {
                if (response?.result?.items) {
                    return { items: response.result.items };
                }
                return { items: [] };
            },
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
            query: ({ entityId, module, documentType }) => {
                const url = `/api/services/app/Documents/GetDocumentsByEntity?entityid=${entityId}&module=${module}&documenttype=${encodeURIComponent(documentType)}`;
                console.log('getDocumentsByEntity - URL:', url);
                console.log('getDocumentsByEntity - Params:', { entityId, module, documentType });
                return url;
            },
            transformResponse: (response: any) => {
                console.log('getDocumentsByEntity - Response:', JSON.stringify(response, null, 2));
                return response;
            },
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
        submitApplication: builder.mutation({
            query: ({ projId, userId }: { projId: number; userId: number }) => ({
                url: `/api/services/app/DiscretionaryProject/SubmitApplication?ProjectId=${projId}&UserID=${userId}`,
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
    useGetOrganizationsBySdfIdQuery,
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
    useGetActiveWindowsQuery,
    useGetActiveWindowsParamsQuery,
    useCreateEditApplicationMutation,
    useDeleteApplicationMutation,
    useCreateEditApplicationDetailsMutation,
    useCreateNotificationMutation,
    useGetNotificationsByUserQuery,
    useMarkNotificationAsReadMutation,
    useRegisterPushTokenMutation,
    useDelinkOrganizationMutation,
    useLinkOrganizationMutation,
    useGetOrgProjectsQuery,
    useGetWinFocusAreaQuery,
    useGetWinAdminCritQuery,
    useGetEvalMethQuery,
    useGetProjectTypeQuery,
    useGetFocusAreaQuery,
    useGetAdminCritQuery,
    useGetProjectTimelineQuery,
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
    useGetOrganizationPhysicalAddressQuery,
    useGetDocumentsByEntityQuery,
    useGetOrgSdfByOrgQuery,
    useLazyGetOrgSdfByOrgQuery,
    useValidateProjSubmissionMutation,
    useSubmitApplicationMutation,
} = api
