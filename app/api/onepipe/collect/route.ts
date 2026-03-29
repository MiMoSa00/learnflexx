import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import crypto from "crypto";

export async function POST(req: NextRequest) {
    try {
        console.log("=== PWA COLLECT STARTED ===");

        const body = await req.json();
        console.log("Collect Payload:", JSON.stringify(body, null, 2));

        const apiKey = process.env.PAYWITHACCOUNT_API_KEY;
        const secretKey = process.env.PAYWITHACCOUNT_SECRET_KEY;
        const baseUrl = process.env.PAYWITHACCOUNT_BASE_URL || "https://api.dev.onepipe.io";

        if (!apiKey || !secretKey) {
            throw new Error("Missing OnePipe API credentials");
        }

        // Validate required fields
        const { account_number, bank_code, amount, customer } = body;

        console.log("Validating fields:");
        console.log("- account_number:", account_number);
        console.log("- bank_code:", bank_code);
        console.log("- amount:", amount);
        console.log("- customer:", customer);

        if (!account_number || !bank_code) {
            throw new Error(`Missing required fields: account_number=${account_number}, bank_code=${bank_code}`);
        }

        // Default amount to 100 if 0 (for testing)
        const finalAmount = amount || 100;

        /**
         * 3DES Encryption (EXACT OnePipe implementation)
         */
        const encrypt3DES = (key: string, text: string): string => {
            const bufferedKey = Buffer.from(key, "utf16le");
            const md5Key = crypto.createHash("md5").update(bufferedKey).digest();
            const finalKey = Buffer.concat([md5Key, md5Key.slice(0, 8)]);
            const iv = Buffer.alloc(8, "\0");

            const cipher = crypto
                .createCipheriv("des-ede3-cbc", finalKey, iv)
                .setAutoPadding(true);

            return cipher.update(text, "utf8", "base64") + cipher.final("base64");
        };

        // Encrypt secure field: account_number;bank_code
        const securePlainText = `${account_number};${bank_code}`;
        const encryptedSecure = encrypt3DES(secretKey, securePlainText);

        // Generate unique references
        const requestRef = body.request_ref || `ref_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
        const transactionRef = body.transaction_ref || `txn_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

        const payload = {
            request_ref: requestRef,
            request_type: "collect",
            auth: {
                type: "bank.account",
                secure: encryptedSecure,
                auth_provider: "PaywithAccount",
            },
            transaction: {
                mock_mode: "Inspect", // Use Inspect until production credentials
                transaction_ref: transactionRef,
                transaction_desc: body.transaction_desc || "Course payment",
                transaction_ref_parent: null,
                amount: Math.round(finalAmount * 100), // Convert to kobo
                customer: {
                    customer_ref: customer?.customer_ref || customer?.mobile_no,
                    firstname: customer?.firstname || "Customer",
                    surname: customer?.surname || "User",
                    email: customer?.email || "customer@example.com",
                    mobile_no: customer?.mobile_no || "08000000000",
                },
                meta: {
                    biller_code: process.env.NEXT_PUBLIC_ONEPIPE_BILLER_CODE || "000752",
                    skip_consent: "true",
                    customer_consent: "",
                    subscription_id: body.subscription_id, // If using existing mandate
                },
                details: {},
            },
        };

        // Generate MD5 signature
        const signatureString = `${requestRef};${secretKey}`;
        const signature = crypto
            .createHash("md5")
            .update(signatureString, "utf8")
            .digest("hex");

        const endpoint = `${baseUrl}/v2/transact`;

        console.log("Sending collect request to OnePipe...");
        console.log("Amount (kobo):", payload.transaction.amount);

        const response = await axios.post(endpoint, payload, {
            headers: {
                Authorization: `Bearer ${apiKey}`,
                Signature: signature,
                "Content-Type": "application/json",
            },
        });

        console.log("✅ Collect Response:", JSON.stringify(response.data, null, 2));

        // Extract USSD code from provider_auth_token
        const providerResponse = response.data?.data?.provider_response || {};
        const ussdCode = providerResponse.provider_auth_token || null;
        const reference = providerResponse.reference || transactionRef;

        return NextResponse.json({
            status: response.data.status,
            message: response.data.message,
            ussd_code: ussdCode,
            reference: reference,
            transaction_ref: transactionRef,
            request_ref: requestRef,
            data: response.data.data,
        });
    } catch (error: any) {
        console.error("❌ Collect Error:", error.response?.data || error.message);

        return NextResponse.json(
            {
                status: "Failed",
                error: error.response?.data || error.message,
            },
            { status: error.response?.status || 500 }
        );
    }
}
