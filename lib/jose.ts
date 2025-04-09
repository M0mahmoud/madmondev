import { jwtVerify, SignJWT } from "jose";

const getSecretKey = () => {
  const SECRET_KEY = process.env.JWT_SECRET_KEY;
  if (!SECRET_KEY || SECRET_KEY.length === 0) {
    throw new Error("JWT_SECRET_KEY is not set");
  }
  return new TextEncoder().encode(SECRET_KEY);
};

export async function encrypt(value: string | number): Promise<string> {
  const secretKey = getSecretKey();
  const jwt = await new SignJWT({ data: String(value) })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("10h")
    .sign(secretKey);

  return encodeURIComponent(jwt);
}

export async function decrypt(token: string): Promise<string> {
  try {
    const secretKey = getSecretKey();
    const decodedToken = decodeURIComponent(token);
    const { payload } = await jwtVerify(decodedToken, secretKey);

    if (typeof payload.data !== "string") {
      throw new Error("Invalid payload data");
    }

    return payload.data;
  } catch (error) {
    console.error("Decryption failed:", error);
    throw new Error("Failed to decrypt the token");
  }
}
