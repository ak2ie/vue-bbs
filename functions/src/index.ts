import * as functions from "firebase-functions";
const app = require("./App");

// リクエストは全てExpressに投げる
// リージョンは東京
exports.app = functions.region("asia-northeast1").https.onRequest(app);
