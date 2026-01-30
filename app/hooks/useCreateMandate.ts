import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export type MandatePayload = {
  request_ref: string;
  request_type: string;
  auth: {
    type: string;
    auth_provider: string;
    secure?: string;
  };
  transaction: {
    mock_mode: string;
    transaction_ref: string;
    transaction_desc: string;
    transaction_ref_parent: string | null;
    amount: number;
    customer: {
      customer_ref: string;
      firstname: string;
      surname: string;
      email: string;
      mobile_no: string;
    };
    meta: {
      amount: string;
      skip_consent: string;
      bvn: string;
      biller_code: string;
      customer_consent: string;
      repeat_end_date: string;
      repeat_frequency: string;
    };
    details: Record<string, any>;
  };
};

export const useCreateMandate = () => {
  return useMutation({
    mutationFn: async (payload: MandatePayload) => {
      try {
        // ✅ SECURE: Call Next.js API route, not OnePipe directly
        const response = await axios.post("/api/onepipe/create-mandate", payload, {
          headers: {
            "Content-Type": "application/json"
            // ❌ NO API keys here - they stay on the server!
          },
        });

        return response.data;
      } catch (error: any) {
        // Log detailed error information
        console.error("=== Mandate Creation Error ===");
        console.error("Status:", error.response?.status);
        console.error("Error Data:", error.response?.data);
        console.error("Error Message:", error.message);
        throw error;
      }
    },
  });
};
