import crypto from 'crypto';
import axios from 'axios';

const apiKey = 'YHn6cHO8QiUvH7SjoYfb_f40abf7c76a54b98ba417523b5d0bb7a';
const secretKey = 'dkF0khhoyLBamLba';
const baseUrl = 'https://api.dev.onepipe.io';

const encrypt3DES = (key, text) => {
  const bufferedKey = Buffer.from(key, 'utf16le');
  const md5Key = crypto.createHash('md5').update(bufferedKey).digest();
  const finalKey = Buffer.concat([md5Key, md5Key.slice(0, 8)]);
  const iv = Buffer.alloc(8, 0);
  const cipher = crypto.createCipheriv('des-ede3-cbc', finalKey, iv).setAutoPadding(true);
  return cipher.update(text, 'utf8', 'base64') + cipher.final('base64');
};

async function testOnePipeV4() {
  console.log("Starting Test V4...");
  const transactionRef = `test-${Date.now()}`;

  const finalPayload = {
    request_ref: transactionRef,
    request_type: 'lookup_bvn_details', // Testing this
    auth: {
      type: null,
      secure: secretKey,
      auth_provider: 'PaywithAccount',
    },
    transaction: {
      mock_mode: 'inspect',
      transaction_ref: transactionRef,
      transaction_desc: 'Test connection',
      transaction_ref_parent: null,
      amount: 100,
      customer: {
        customer_ref: 'test@test.com',
        firstname: 'Test',
        surname: 'User',
        email: 'test@test.com',
        mobile_no: '+2348012345678',
      },
      details: {
        bvn: '22222222222',
      }
    }
  };

  const signatureString = `${finalPayload.request_ref};${secretKey}`;
  const signature = crypto.createHash("md5").update(signatureString, "utf8").digest("hex");

  console.log("Sending V4 payload...");
  try {
    const response = await axios.post(`${baseUrl}/v2/transact`, finalPayload, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
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

testOnePipeV4();
