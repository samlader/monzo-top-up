import dotenv from "dotenv";

dotenv.config({ path: `.env` });

const MONZO_API_URL = "https://api.monzo.com";

const TOPUP_AMOUNT = 10000; // £100 in minor units (pence)
const THRESHOLD = 20000; // £200 in minor units (pence)

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const POT_ID = process.env.POT_ID;

export { POT_ID, CLIENT_ID, MONZO_API_URL, CLIENT_SECRET, TOPUP_AMOUNT, THRESHOLD };
