import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    console.log("=== MANDATE CREATION REQUEST STARTED ===");
    const body = await req.json();
    console.log("Request Body Received:", JSON.stringify(body, null, 2));

    // ✅ Server-side only env vars (NO NEXT_PUBLIC_ prefix for security!)
    const apiKey = process.env.PAYWITHACCOUNT_API_KEY;
    const secretKey = process.env.PAYWITHACCOUNT_SECRET_KEY?.trim();
    const baseUrl = process.env.PAYWITHACCOUNT_BASE_URL || "https://api.dev.onepipe.io";

    console.log("Debug Credentials Check:");
    console.log("API Key Present:", !!apiKey);
    console.log("Secret Key Present:", !!secretKey);
    console.log("Base URL:", baseUrl);

    if (!apiKey || !secretKey) {
      throw new Error("Missing API Credentials (API Key or Secret Key)");
    }

    // Helper function to encrypt BVN using AES
    const encryptBVN = (bvn: string, key: string): string => {
      // OnePipe typically uses AES-256-CBC encryption
      const keyBuffer = Buffer.from(key.padEnd(32, '0').substring(0, 32));
      const iv = Buffer.alloc(16, 0);

      const cipher = crypto.createCipheriv('aes-256-cbc', keyBuffer, iv);
      let encrypted = cipher.update(bvn, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      return encrypted;
    };

    // 1. Inject server-side secure details into body and encrypt BVN
    const encryptedBVN = body.transaction?.meta?.bvn
      ? encryptBVN(body.transaction.meta.bvn, secretKey)
      : null;

    const finalBody = {
      ...body,
      auth: {
        ...body.auth,
        secure: secretKey,
        auth_provider: "PaywithAccount"
      },
      transaction: {
        ...body.transaction,
        meta: {
          ...body.transaction.meta,
          bvn: encryptedBVN || body.transaction.meta.bvn,
        }
      }
    };

    // 2. Generate MD5 Signature as requested by user
    // Signature = MD5(ref + ";" + secret)
    if (!finalBody.request_ref) {
      throw new Error("Missing request_ref in payload");
    }

    const signatureString = `${finalBody.request_ref};${secretKey}`;
    const signature = crypto.createHash('md5').update(signatureString).digest('hex');

    // Send request to OnePipe API
    const endpoint = baseUrl.endsWith('/v2') ? `${baseUrl}/transact` : `${baseUrl}/v2/transact`;

    console.log("Calling OnePipe Endpoint:", endpoint);
    console.log("Ref:", finalBody.request_ref);
    console.log("Signature (MD5):", signature);
    console.log("Request Type:", finalBody.request_type);
    console.log("Auth Strategy: Bearer + MD5 Signature + PaywithAccount Provider + BVN Encryption");
    console.log("Full Payload Being Sent:", JSON.stringify(finalBody, null, 2));

    const response = await axios.post(
      endpoint,
      finalBody,
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
          "Signature": signature,
        },
      }
    );

    console.log("✅ OnePipe Response:", JSON.stringify(response.data, null, 2));
    return NextResponse.json(response.data);
  } catch (err: any) {
    console.error("OnePipe API Error:", err.message);
    if (err.response) {
      console.error("OnePipe Response Data:", JSON.stringify(err.response.data, null, 2));
      console.error("OnePipe Status:", err.response.status);
    }
    return NextResponse.json(
      { error: err.response?.data || err.message },
      { status: err.response?.status || 500 }
    );
  }
}