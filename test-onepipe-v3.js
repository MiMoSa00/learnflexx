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

async function testOnePipeV3() {
  console.log("Starting Test V3...");
  const transactionRef = `test-${Date.now()}`;
  const encryptedSecure = encrypt3DES(secretKey, '1234567890;058');

  const finalPayload = {
    request_ref: transactionRef,
    request_type: 'create mandate',
    auth: {
      type: 'bank.account',
      secure: encryptedSecure,
      auth_provider: 'PaywithAccount', // changed from Sandbox to PaywithAccount
    },
    transaction: {
      mock_mode: 'inspect',
      transaction_ref: transactionRef,
      transaction_desc: 'Creating a mandate',
      amount: 0,
      customer: {
        customer_ref: '2348123456789',
        firstname: 'John',
        surname: 'Doe',
        email: 'test@test.com',
        mobile_no: '2348123456789',
      },
      meta: {
        amount: '1000',
        skip_consent: 'true',
        bvn: encrypt3DES(secretKey, '22222222222'),
        biller_code: '000752',
        customer_consent: 'https://paywithaccount.com/consent_template.pdf',
        repeat_end_date: '2030-04-10-08-00-00',
        repeat_frequency: 'once',
      }
    }
  };

  const authorization = Buffer.from(`${apiKey}:${secretKey}`).toString('base64');
  const signatureString = `${apiKey}${secretKey}${finalPayload.request_ref}`;
  const signature = Buffer.from(signatureString).toString('base64');

  console.log("Sending V3 payload...");
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

testOnePipeV3();
