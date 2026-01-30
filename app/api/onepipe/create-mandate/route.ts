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

    // Helper function to encrypt using Triple DES (3DES) - OnePipe's expected encryption
    const encrypt3DES = (sharedKey: string, plainText: string): string => {
      // Step 1: Convert shared key to UTF-16LE buffer
      const bufferedKey = Buffer.from(sharedKey, 'utf16le');

      // Step 2: Create MD5 hash of the key
      const key = crypto.createHash('md5').update(bufferedKey).digest();

      // Step 3: Create 24-byte key for 3DES by concatenating MD5 hash (16 bytes) + first 8 bytes
      const newKey = Buffer.concat([key, key.slice(0, 8)]);

      // Step 4: Use 8-byte zero-filled IV
      const IV = Buffer.alloc(8, 0);

      // Step 5: Encrypt with Triple DES CBC mode
      const cipher = crypto.createCipheriv('des-ede3-cbc', newKey, IV).setAutoPadding(true);
      return cipher.update(plainText, 'utf8', 'base64') + cipher.final('base64');
    };

    // 1. Encrypt BVN using Triple DES (auth.secure gets plain secret key)
    const encryptedBVN = body.transaction?.meta?.bvn
      ? encrypt3DES(secretKey, body.transaction.meta.bvn)
      : null;
    const encryptedSecure = encrypt3DES(secretKey, `${body.transaction?.customer?.account_number};${body.transaction?.customer?.bank_code}`);

    console.log("Encryption Debug:");
    console.log("Original BVN:", body.transaction?.meta?.bvn);
    console.log("Encrypted BVN (3DES Base64):", encryptedBVN);
    console.log("Encrypted Secure (3DES Base64):", encryptedSecure);

    const finalBody = {
      ...body,
      auth: {
        ...body.auth,
        secure: encryptedSecure,  // Plain secret key, NOT encrypted
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

    // Debug: Log the exact string being hashed (mask part of secret for security)
    console.log("Signature String Format: [request_ref];[secret_key]");
    console.log("Request Ref:", finalBody.request_ref);
    console.log("Secret Key Length:", secretKey.length);
    console.log("Full Signature String (for debug):", signatureString);

    // Explicitly use UTF-8 encoding to match the Postman MD5 implementation
    const signature = crypto.createHash('md5').update(signatureString, 'utf8').digest('hex');

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