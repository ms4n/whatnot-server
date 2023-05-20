const express = require("express");
const app = express();
app.use(express.json());
const axios = require("axios");
require("dotenv").config();

const port = process.env.PORT || 3000;
const access_token = process.env.ACCESS_TOKEN;
const webhook_token = process.env.WEBHOOK_TOKEN;

app.listen(port, () => {
  console.log(`Webhook listening on port ${port}`);
});

app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const challenge = req.query["hub.challenge"];
  const token = req.query["hub.verify_token"];

  if (mode === "subscribe" && token === webhook_token) {
    res.status(200).send(challenge);
  } else {
    res.status(403).end();
  }
});

app.post("/webhook", (req, res) => {
  const body_param = req.body;
  console.log(JSON.stringify(body_param, null, 2));

  if (
    body_param.object &&
    body_param.entry &&
    body_param.entry[0].changes &&
    body_param.entry[0].changes[0].value.messages &&
    body_param.entry[0].changes[0].value.messages[0]
  ) {
    const phone_no_id =
      body_param.entry[0].changes[0].value.metadata.phone_number_id;
    const from_phone_no = body_param.entry[0].changes[0].value.messages[0].from;
    const message_body =
      body_param.entry[0].changes[0].value.messages[0].text.body;

    let responseMessage = `Hello, responding from webhook, your message was ${message_body}`;

    if (message_body.toLowerCase().includes("sanjay")) {
      responseMessage = "Sanjay is my developer!";
    }

    axios.post(
      `https://graph.facebook.com/v16.0/${phone_no_id}/messages?access_token=${access_token}`,
      {
        messaging_product: "whatsapp",
        to: from_phone_no,
        text: {
          body: responseMessage,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

app.get("/", (req, res) => {
  res.status(200).send("Webhook listening");
});
