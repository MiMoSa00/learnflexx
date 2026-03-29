import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import crypto from "crypto";

export async function POST(req: NextRequest) {
    try {
        console.log("=== TRANSACTION STATUS CHECK ===");

        const body = await req.json();
        const { transaction_ref, request_ref } = body;

        if (!transaction_ref) {
            throw new Error("Missing transaction_ref");
        }

        const apiKey = process.env.PAYWITHACCOUNT_API_KEY;
        const secretKey = process.env.PAYWITHACCOUNT_SECRET_KEY;
        const baseUrl = process.env.PAYWITHACCOUNT_BASE_URL || "https://api.dev.onepipe.io";

        if (!apiKey || !secretKey) {
            throw new Error("Missing OnePipe API credentials");
        }

        // Generate new request ref for status check
        const statusRequestRef = request_ref || `status_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

        const payload = {
            request_ref: statusRequestRef,
            request_type: "query_transaction",
            auth: {
                type: null,
                secure: null,
                auth_provider: "PaywithAccount",
                route_mode: null,
            },
            transaction: {
                mock_mode: "Inspect",
                transaction_ref: transaction_ref,
                transaction_desc: "Query transaction status",
                transaction_ref_parent: null,
                amount: 0,
                customer: {
                    customer_ref: "status_check",
                    firstname: "Status",
                    surname: "Check",
                    email: "status@check.com",
                    mobile_no: "08000000000",
                },
                meta: {},
                details: null,
            },
        };

        // Generate MD5 signature
        const signatureString = `${statusRequestRef};${secretKey}`;
        const signature = crypto
            .createHash("md5")
            .update(signatureString, "utf8")
            .digest("hex");

        const endpoint = `${baseUrl}/v2/transact`;

        console.log("Checking transaction status for:", transaction_ref);

        const response = await axios.post(endpoint, payload, {
            headers: {
                Authorization: `Bearer ${apiKey}`,
                Signature: signature,
                "Content-Type": "application/json",
            },
        });

        console.log("✅ Status Response:", response.data.status);

        const providerResponse = response.data?.data?.provider_response || {};

        // Determine transaction status
        let transactionStatus = "pending";
        if (response.data.status === "Successful") {
            const providerCode = response.data?.data?.provider_response_code;
            if (providerCode === "00") {
                transactionStatus = "successful";
            } else if (providerCode === "09" || providerCode === "pending") {
                transactionStatus = "pending";
            } else {
                transactionStatus = "failed";
            }
        }

        return NextResponse.json({
            status: response.data.status,
            transaction_status: transactionStatus,
            message: response.data.message,
            provider_response: providerResponse,
            data: response.data.data,
        });
    } catch (error: any) {
        console.error("❌ Status Check Error:", error.response?.data || error.message);

        return NextResponse.json(
            {
                status: "Failed",
                transaction_status: "error",
                error: error.response?.data || error.message,
            },
            { status: error.response?.status || 500 }
        );
    }
}
