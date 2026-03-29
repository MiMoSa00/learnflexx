import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import crypto from "crypto";

export async function POST(req: NextRequest) {
    try {
        console.log("=== GET BANKS STARTED ===");

        const body = await req.json();

        const apiKey = process.env.PAYWITHACCOUNT_API_KEY;
        const secretKey = process.env.PAYWITHACCOUNT_SECRET_KEY;
        const baseUrl = process.env.PAYWITHACCOUNT_BASE_URL || "https://api.dev.onepipe.io";

        if (!apiKey || !secretKey) {
            throw new Error("Missing OnePipe API credentials");
        }

        // Generate unique references
        const requestRef = `ref_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
        const transactionRef = `txn_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

        const payload = {
            request_ref: requestRef,
            request_type: "get_banks",
            auth: {
                type: null,
                secure: null,
                auth_provider: "PaywithAccount",
                route_mode: null,
            },
            transaction: {
                mock_mode: "Inspect", // Use Inspect for now until production credentials
                transaction_ref: transactionRef,
                transaction_desc: "Get banks list",
                transaction_ref_parent: null,
                amount: 0,
                customer: {
                    customer_ref: body.customer_ref || "default_customer",
                    firstname: body.firstname || "Customer",
                    surname: body.surname || "User",
                    email: body.email || "customer@example.com",
                    mobile_no: body.mobile_no || "08000000000",
                },
                meta: {
                    pwa_enabled_only: true, // Only banks with DD enabled
                },
                details: null,
            },
        };

        // Generate MD5 signature
        const signatureString = `${requestRef};${secretKey}`;
        const signature = crypto
            .createHash("md5")
            .update(signatureString, "utf8")
            .digest("hex");

        const endpoint = `${baseUrl}/v2/transact`;

        console.log("Fetching banks from OnePipe...");

        const response = await axios.post(endpoint, payload, {
            headers: {
                Authorization: `Bearer ${apiKey}`,
                Signature: signature,
                "Content-Type": "application/json",
            },
        });

        console.log("✅ Get Banks Response:", response.data.status);
        console.log("Full Response Data:", JSON.stringify(response.data, null, 2));

        // Extract banks from response
        const banks = response.data?.data?.provider_response?.banks || [];
        console.log("Extracted banks:", JSON.stringify(banks, null, 2));
        console.log("Number of banks:", banks.length);

        return NextResponse.json({
            status: response.data.status,
            banks: banks,
            message: response.data.message,
            raw_response: response.data, // Include raw for debugging
        });
    } catch (error: any) {
        console.error("❌ Get Banks Error:", error.response?.data || error.message);

        return NextResponse.json(
            {
                status: "Failed",
                banks: [],
                error: error.response?.data || error.message,
            },
            { status: error.response?.status || 500 }
        );
    }
}
