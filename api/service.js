import fetch from "node-fetch";
import { kv } from "@vercel/kv";
import { POT_ID, MONZO_API_URL, CLIENT_ID, CLIENT_SECRET } from "./config.js";

// TODO: Move client logic into a separate module

async function getHeaders() {
  return { Authorization: `Bearer ${await getValidAccessToken()}` };
}

async function getAccountBalance(account_id) {
  const url = `${MONZO_API_URL}/balance?account_id=${account_id}`;

  try {
    const response = await fetch(url, { headers: await getHeaders() });

    if (!response.ok) {
      const errorResponse = await response.text();

      console.error("Failed to fetch account balance", {
        status: response.status,
        response: errorResponse,
      });

      throw new Error("Failed to fetch account balance");
    }
    const data = await response.json();

    return data.balance;
  } catch (error) {
    throw new Error("Failed to fetch account balance");
  }
}

async function transferFromPot(amount, account_id, unique_id) {
  const data = new URLSearchParams({
    destination_account_id: account_id,
    amount: amount.toString(),
    dedupe_id: `unique_id_${unique_id}`,
  });

  try {
    const response = await fetch(`${MONZO_API_URL}/pots/${POT_ID}/withdraw`, {
      method: "PUT",
      headers: {
        ...(await getHeaders()),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: data.toString(),
    });

    if (!response.ok) {
      const errorResponse = await response.text();

      console.error("Failed to transfer from pot", {
        status: response.status,
        payload: data.toString(),
        response: errorResponse,
      });

      throw new Error("Failed to transfer from pot");
    }

    const responseData = await response.json();

    return responseData;
  } catch (error) {
    throw new Error("Failed to transfer from pot");
  }
}

async function refreshAccessToken() {
  const refreshToken = await kv.get("MONZO_REFRESH_TOKEN");
  const data = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    refresh_token: refreshToken,
  });

  try {
    const response = await fetch(`${MONZO_API_URL}/oauth2/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: data.toString(),
    });

    if (!response.ok) {
      const errorResponse = await response.text();

      console.error("Failed to refresh access token", {
        status: response.status,
        payload: data.toString(),
        response: errorResponse,
      });

      throw new Error("Failed to refresh access token");
    }
    const responseData = await response.json();

    await kv.set("MONZO_ACCESS_TOKEN_DATA", {
      token: responseData.access_token,
      expires_at: Date.now() + responseData.expires_in * 1000,
    });

    await kv.set("MONZO_REFRESH_TOKEN", responseData.refresh_token);

    return responseData.access_token;
  } catch (error) {
    console.log(error);

    throw new Error("Failed to refresh access token");
  }
}

async function getValidAccessToken() {
  const tokenData = await kv.get("MONZO_ACCESS_TOKEN_DATA");

  if (tokenData && tokenData.expires_at > Date.now()) {
    return tokenData.token;
  } else {
    console.error("REFRESHING TOKEN");

    return await refreshAccessToken();
  }
}

export {
  getAccountBalance,
  transferFromPot,
  refreshAccessToken,
  getValidAccessToken,
};
