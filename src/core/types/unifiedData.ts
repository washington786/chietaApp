import { OrganisationDto } from "../models/organizationDto";

export type UnifiedOrgItem = {
    type: 'main' | 'footer';
    data: OrganisationDto;
};