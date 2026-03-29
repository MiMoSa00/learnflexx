import crypto from 'crypto';

// Your secret key
const secretKey = 'dkF0khhoyLBamLba';

// Test values (from your earlier logs)
const accountNumber = '3159557489';
const bankCode = '011';
const bvn = '22573917945';

// Encryption function (UTF-16LE method from OnePipe docs)
function encrypt3DES(key, text) {
  const bufferedKey = Buffer.from(key, 'utf16le');
  const md5Key = crypto.createHash('md5').update(bufferedKey).digest();
  const finalKey = Buffer.concat([md5Key, md5Key.slice(0, 8)]);
  const iv = Buffer.alloc(8, 0);

  const cipher = crypto.createCipheriv('des-ede3-cbc', finalKey, iv).setAutoPadding(true);
  return cipher.update(text, 'utf8', 'base64') + cipher.final('base64');
}

// Decryption function to verify
function decrypt3DES(key, encryptedText) {
  try {
    const bufferedKey = Buffer.from(key, 'utf16le');
    const md5Key = crypto.createHash('md5').update(bufferedKey).digest();
    const finalKey = Buffer.concat([md5Key, md5Key.slice(0, 8)]);
    const iv = Buffer.alloc(8, 0);

    const decipher = crypto.createDecipheriv('des-ede3-cbc', finalKey, iv).setAutoPadding(true);
    return decipher.update(encryptedText, 'base64', 'utf8') + decipher.final('utf8');
  } catch (e) {
    return 'DECRYPTION FAILED: ' + e.message;
  }
}

console.log('=== ENCRYPTION TEST ===');
console.log('Secret Key:', secretKey);
console.log('');

// Secure field
const securePlainText = accountNumber + ';' + bankCode;
const encryptedSecure = encrypt3DES(secretKey, securePlainText);
console.log('=== auth.secure ===');
console.log('Plain text:', securePlainText);
console.log('Encrypted:', encryptedSecure);
console.log('Decrypted back:', decrypt3DES(secretKey, encryptedSecure));
console.log('');

// BVN field
const encryptedBVN = encrypt3DES(secretKey, bvn);
console.log('=== BVN ===');
console.log('Plain text:', bvn);
console.log('Encrypted:', encryptedBVN);
console.log('Decrypted back:', decrypt3DES(secretKey, encryptedBVN));
