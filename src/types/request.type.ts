import { RequestTypeType } from './request-type.type';

export type RequestType = {
    name: string,
    phone: string,
    service?: string,
    type: RequestTypeType
}
