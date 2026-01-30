// utils/encrypt.ts
export async function encrypt(sharedKey: string, plainText: string): Promise<string> {
  // Convert sharedKey to UTF-16LE bytes
  const encoder = new TextEncoder(); 
  const keyBytes = new Uint8Array(sharedKey.length * 2);
  for (let i = 0; i < sharedKey.length; i++) {
    keyBytes[i * 2] = sharedKey.charCodeAt(i) & 0xff;
    keyBytes[i * 2 + 1] = sharedKey.charCodeAt(i) >> 8;
  }

  // MD5 hash of the key
  const md5Hash = await crypto.subtle.digest("MD5", keyBytes);

  // Triple DES key: MD5 hash + first 8 bytes of MD5 hash
  const hashArray = new Uint8Array(md5Hash);
  const tripleDESKey = new Uint8Array([...hashArray, ...hashArray.slice(0, 8)]);

  // IV: 8 bytes of zeros
  const iv = new Uint8Array(8);

  // Encode plaintext
  const plainBytes = encoder.encode(plainText);

  // Import key for TripleDES-CBC
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    tripleDESKey,
    { name: "DES-EDE3-CBC" }, // Note: Browser Crypto API does NOT support DES natively
    false,
    ["encrypt"]
  );

  // Encrypt
  const encrypted = await crypto.subtle.encrypt(
    { name: "DES-EDE3-CBC", iv },
    cryptoKey,
    plainBytes
  );

  // Convert to base64
  const base64 = btoa(String.fromCharCode(...new Uint8Array(encrypted)));
  return base64;
}
