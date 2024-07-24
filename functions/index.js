const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

exports.saveToken = functions.https.onRequest(async (req, res) => {
  // Check for POST request
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const { userId, token } = req.body;

  if (!userId || !token) {
    return res.status(400).send("Bad Request");
  }

  try {
    await db.collection("users").doc(userId).set(
      {
        fcmToken: token,
      },
      { merge: true }
    );
    return res.status(200).send("Token saved successfully");
  } catch (error) {
    console.error("Error saving token: ", error);
    return res.status(500).send("Internal Server Error");
  }
});
