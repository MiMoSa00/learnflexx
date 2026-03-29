import crypto from 'crypto';
import axios from 'axios';

const apiKey = 'YHn6cHO8QiUvH7SjoYfb_f40abf7c76a54b98ba417523b5d0bb7a';
const secretKey = 'dkF0khhoyLBamLba';
const baseUrl = 'https://api.dev.onepipe.io';

async function testOnePipeV2() {
  console.log("Starting Test V2...");
  const transactionRef = `test-${Date.now()}`;

  const finalPayload = {
    request_ref: transactionRef,
    request_type: 'lookup_bvn_details', // Try a simple request first based on paywithaccount.ts
    auth: {
      type: null,
      secure: secretKey,
      auth_provider: 'Sandbox',
    },
    transaction: {
      mock_mode: 'inspect',
      transaction_ref: transactionRef,
      transaction_desc: 'Creating a mandate',
      transaction_ref_parent: null,
      amount: 100,
      customer: {
        customer_ref: 'test@test.com',
        firstname: 'John',
        surname: 'Doe',
        email: 'test@test.com',
        mobile_no: '+2348123456789',
      },
      meta: null, 
      details: {
        bvn: '22222222222'
      }
    }
  };

  const authorization = Buffer.from(`${apiKey}:${secretKey}`).toString('base64');
  const signatureString = `${apiKey}${secretKey}${finalPayload.request_ref}`;
  const signature = Buffer.from(signatureString).toString('base64');

  console.log("Sending V2 payload...");
  try {
    const response = await axios.post(`${baseUrl}/v2/transact`, finalPayload, {
      headers: {
        Authorization: `Basic ${authorization}`,
        Signature: signature,
        "Content-Type": "application/json",
      },
    });
    console.log("SUCCESS:", response.data);
  } catch (error) {
    if (error.response) {
      console.log("FAILED WITH STATUS:", error.response.status);
      console.log("ERROR DATA:", JSON.stringify(error.response.data, null, 2));
    } else {
      console.log("FATAL ERROR:", error.message);
    }
  }
}

testOnePipeV2();
