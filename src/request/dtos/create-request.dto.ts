export class CreateRequestDto {
    requestType: string;
    description: string;
    name: string;
    status: string;
    remarks: string;
    hours: number;
    userId: number;
    transactionId: number;
}