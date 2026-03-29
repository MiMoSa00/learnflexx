import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export interface CollectPayload {
    account_number: string;
    bank_code: string;
    amount: number; // Amount in Naira
    customer: {
        customer_ref: string;
        firstname: string;
        surname: string;
        email: string;
        mobile_no: string;
    };
    transaction_desc?: string;
    subscription_id?: number;
}

export interface CollectResponse {
    status: string;
    message: string;
    ussd_code: string | null;
    reference: string;
    transaction_ref: string;
    request_ref: string;
    data?: any;
    error?: any;
}

export const usePWACollect = () => {
    return useMutation<CollectResponse, Error, CollectPayload>({
        mutationFn: async (payload: CollectPayload) => {
            try {
                const response = await axios.post("/api/onepipe/collect", payload);
                return response.data;
            } catch (error: any) {
                console.error("PWA Collect Error:", error.response?.data);
                throw error;
            }
        },
    });
};
