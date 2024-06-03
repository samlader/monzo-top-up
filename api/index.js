import express from "express";
import bodyParser from "body-parser";

import { THRESHOLD, TOPUP_AMOUNT } from "./config.js";
import { getAccountBalance, transferFromPot } from "./service.js";

const app = express();

app.use(bodyParser.json());

app.get("/", async (req, res) => {
  console.log("healthcheck");
  return res.status(200).json({ status: "success" });
});

app.post("/monzo", async (req, res) => {
  console.log("webhook received");

  const data = req.body;

  if (data.type === "transaction.created") {
    try {
      const balance = await getAccountBalance(data.data.account_id);

      if (balance < THRESHOLD) {
        await transferFromPot(TOPUP_AMOUNT, data.data.account_id, data.data.id);

        console.log(`transferred ${TOPUP_AMOUNT} from pot to current account`);

        return res.status(200).json({
          status: "success",
        });
      }

      console.log("no action needed");

      return res.status(200).json({ status: "no action needed" });
    } catch (error) {
      console.error(error.message);

      return res
        .status(500)
        .json({ status: "error", message: "unable to process event" });
    }
  }

  console.log("irrelevant event", data.type);

  return res.status(200).json({ status: "success" });
});

app.listen(4000, () => console.log("Server ready on port 4000."));

export default app;
