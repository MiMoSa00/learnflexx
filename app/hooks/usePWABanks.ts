import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface Bank {
    id: number;
    bank_name: string;
    bank_cbn_code: string; // This is the actual code OnePipe uses
    bank_nip_code: string;
    logo_url: string | null;
}

interface GetBanksResponse {
    status: string;
    banks: Bank[];
    message?: string;
    error?: any;
}

export const usePWABanks = () => {
    return useQuery<GetBanksResponse>({
        queryKey: ["pwa-banks"],
        queryFn: async () => {
            const response = await axios.post("/api/onepipe/get-banks", {
                customer_ref: "default",
                firstname: "Customer",
                surname: "User",
                email: "customer@example.com",
                mobile_no: "08000000000",
            });
            return response.data;
        },
        staleTime: 1000 * 60 * 30, // Cache for 30 minutes
        refetchOnWindowFocus: false,
    });
};
