import type { NextApiRequest, NextApiResponse } from "next";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  type Address = {
    streetNumber: string;
    streetName: string;
    city: string;
    state: string;
    zipCode: string;
  };
  const address = req.body as Address;
  // const { streetNumber, streetName, city, state, zipCode } = req.body as Address;
  if (!process.env.SMARTY_AUTH_ID || !process.env.SMARTY_AUTH_TOKEN) {
    throw new Error("Missing Smarty credentials");
  }
  const queryParams = new URLSearchParams({
    "auth-id": process.env.SMARTY_AUTH_ID,
    "auth-token": process.env.SMARTY_AUTH_TOKEN,
    license: "us-core-cloud",
    street: `${address.streetNumber} ${address.streetName}`,
    city: address.city,
    state: address.state,
    zipcode: address.zipCode,
  });

  const url = `https://us-street.api.smartystreets.com/street-address?${queryParams.toString()}`;
  console.log(url);
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Host: "localhost:3000",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Smarty API Error:", errorText);
      throw new Error("Failed to cleanse address");
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).json({ error: err.message });
  }
}
