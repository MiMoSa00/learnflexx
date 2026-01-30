import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    console.log("=== CREATE MANDATE STARTED ===");

    const body = await req.json();
    console.log("Incoming Payload:", JSON.stringify(body, null, 2));

    const apiKey = process.env.PAYWITHACCOUNT_API_KEY;
    const secretKey = process.env.PAYWITHACCOUNT_SECRET_KEY;
    const baseUrl =
      process.env.PAYWITHACCOUNT_BASE_URL || "https://api.dev.onepipe.io";

    if (!apiKey || !secretKey) {
      throw new Error("Missing OnePipe API credentials");
    }

    /**
     * 3DES Encryption (EXACT OnePipe implementation)
     */
    const encrypt3DES = (key: string, text: string): string => {
      const bufferedKey = Buffer.from(key, "utf16le");
      const md5Key = crypto.createHash("md5").update(bufferedKey).digest();
      const finalKey = Buffer.concat([md5Key, md5Key.slice(0, 8)]);
      const iv = Buffer.alloc(8, "\0");

      const cipher = crypto.createCipheriv(
        "des-ede3-cbc",
        finalKey,
        iv
      ).setAutoPadding(true);

      return cipher.update(text, "utf8", "base64") + cipher.final("base64");
    };

    /**
     * ✅ SECURE FIELD (ONLY THIS IS ENCRYPTED)
     * Format: account_number;bank_code
     */
    const accountNumber = body.transaction.customer.account_number;
    const bankCode = body.transaction.customer.bank_code;

    if (!accountNumber || !bankCode) {
      throw new Error("Missing account_number or bank_code");
    }

    const securePlainText = `${accountNumber};${bankCode}`;
    const encryptedSecure = encrypt3DES(secretKey, securePlainText);

    /**
     * ✅ FINAL PAYLOAD (BVN IS PLAIN TEXT)
     * ❌ DO NOT SEND account_number OR bank_code
     */
    const finalPayload = {
      request_ref: body.request_ref,
      request_type: body.request_type,
      auth: {
        type: "bank.account",
        secure: encryptedSecure,
        auth_provider: "PaywithAccount",
      },
      transaction: {
        mock_mode: "Live",
        transaction_ref: body.transaction.transaction_ref,
        transaction_desc: body.transaction.transaction_desc,
        transaction_ref_parent: null,
        amount: 0,
        customer: {
          customer_ref: body.transaction.customer.customer_ref,
          firstname: body.transaction.customer.firstname,
          surname: body.transaction.customer.surname,
          email: body.transaction.customer.email,
          mobile_no: body.transaction.customer.mobile_no,
        },
        meta: {
          amount: body.transaction.meta.amount,
          skip_consent: "true",
          bvn: body.transaction.meta.bvn, // ✅ PLAIN TEXT
          biller_code: body.transaction.meta.biller_code,
          customer_consent: body.transaction.meta.customer_consent,
          repeat_end_date: body.transaction.meta.repeat_end_date,
          repeat_frequency: body.transaction.meta.repeat_frequency,
        },
        details: {},
      },
    };

    /**
     * ✅ SIGNATURE = MD5(request_ref;secret_key)
     */
    const signatureString = `${finalPayload.request_ref};${secretKey}`;
    const signature = crypto
      .createHash("md5")
      .update(signatureString, "utf8")
      .digest("hex");

    const endpoint = `${baseUrl}/v2/transact`;

    console.log("Final Payload:", JSON.stringify(finalPayload, null, 2));
    console.log("Signature:", signature);

    const response = await axios.post(endpoint, finalPayload, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Signature: signature,
        "Content-Type": "application/json",
      },
    });

    console.log("✅ OnePipe Success:", response.data);
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("❌ OnePipe Error:", error.response?.data || error.message);

    return NextResponse.json(
      {
        error: error.response?.data || error.message,
      },
      { status: error.response?.status || 500 }
    );
  }
}
