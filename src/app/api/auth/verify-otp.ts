import { NextApiRequest, NextApiResponse } from "next";
import { signIn } from "next-auth/react";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { otp, loginToken } = req.body;

  if (!otp) {
    return res.status(400).json({ error: "OTP is required" });
  }

  try {
    // This would normally be handled by NextAuth, but for API routes:
    const result = await signIn("telegram-otp", {
      otp,
      loginToken,
      redirect: false,
    });

    if (result?.error) {
      return res.status(400).json({ error: result.error });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({ error: "Verification failed" });
  }
}
