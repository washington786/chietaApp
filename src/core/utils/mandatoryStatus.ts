import { mandatoryStatuses } from "../helpers/data"

export const getMandatoryStatus = (statusId: number): string | undefined => {
    let status = mandatoryStatuses.find(item => {
        if (item.id === statusId) {
            return item.statusDesc
        }
    });
    return status?.statusDesc;
}