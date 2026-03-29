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

async function testOnePipe(testName, payloadMutator) {
  const transactionRef = `test-${Date.now()}-${Math.floor(Math.random()*1000)}`;
  const encryptedSecure = encrypt3DES(secretKey, '1234567890;058');

  let finalPayload = {
    request_ref: transactionRef,
    request_type: 'create mandate',
    auth: {
      type: 'bank.account',
      secure: encryptedSecure,
      auth_provider: 'PaywithAccount',
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
        mobile_no: '+2348123456789',
      },
      meta: {
        amount: '1000',
        skip_consent: 'true',
        bvn: encrypt3DES(secretKey, '22222222222'),
        biller_code: '000752',
      }
    }
  };

  finalPayload = payloadMutator(finalPayload);

  const signatureString = `${finalPayload.request_ref};${secretKey}`;
  const signature = crypto.createHash("md5").update(signatureString, "utf8").digest("hex");

  try {
    const response = await axios.post(`${baseUrl}/v2/transact`, finalPayload, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Signature: signature,
        "Content-Type": "application/json",
      },
    });
    console.log(`[${testName}] SUCCESS:`, !!response.data);
    return true;
  } catch (error) {
    let msg = "unknown";
    if (error.response?.data?.error?.message) {
      msg = error.response.data.error.message;
    } else if (error.response?.data?.errors?.[0]?.message) {
      msg = error.response.data.errors[0].message;
    }
    console.log(`[${testName}] FAILED:`, msg);
    return false;
  }
}

async function runTests() {
  await testOnePipe("1: Default", p => p);
  await testOnePipe("2: request_type = setup_mandate", p => { p.request_type = "setup_mandate"; return p; });
  await testOnePipe("3: Plain BVN", p => { p.transaction.meta.bvn = '22222222222'; return p; });
  await testOnePipe("4: Amount = 1000 (int)", p => { p.transaction.amount = 1000; return p; });
  await testOnePipe("5: mobile_no without +", p => { p.transaction.customer.mobile_no = '2348123456789'; return p; });
  await testOnePipe("6: secure plain text", p => { p.auth.secure = '1234567890;058'; return p; });
  await testOnePipe("7: All generic fixes", p => { 
    p.request_type = "setup_mandate";
    p.transaction.meta.bvn = '22222222222';
    p.transaction.customer.mobile_no = '2348123456789';
    return p; 
  });
}

runTests();
