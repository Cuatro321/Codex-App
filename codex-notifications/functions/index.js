const functions = require("firebase-functions");
const admin = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp();
}

// Colecciones del Códex que disparan notificaciones
const CODEX_COLLECTIONS = [
  "assets",
  "characters",
  "domains",
  "enemies",
  "emblems",
  "guides",
  "stories",
  "traps",
];

// Cuando se registra un nuevo token, lo suscribimos al topic "codex-updates"
exports.subscribeTokenToCodexUpdates = functions.firestore
  .document("deviceTokens/{tokenId}")
  .onCreate(async (snap, context) => {
    const token = context.params.tokenId;

    try {
      await admin.messaging().subscribeToTopic(token, "codex-updates");
      console.log("Token suscrito a codex-updates:", token);
    } catch (err) {
      console.error("Error suscribiendo token:", err);
    }

    return null;
  });

// Cuando se crea contenido nuevo en cualquier colección del Códex,
// mandamos una notificación al topic "codex-updates".
exports.codexNewEntryNotification = functions.firestore
  .document("{collectionId}/{docId}")
  .onCreate(async (snap, context) => {
    const collectionId = context.params.collectionId;

    if (!CODEX_COLLECTIONS.includes(collectionId)) {
      // No es una colección del Códex -> nada
      return null;
    }

    const data = snap.data() || {};
    const titleField =
      data.title || data.name || "Nuevo contenido en el Códex";

    const body = `Se añadió "${titleField}" en ${collectionId}.`;

    const message = {
      notification: {
        title: "Nuevo contenido en el Códex",
        body,
      },
      topic: "codex-updates",
    };

    try {
      await admin.messaging().send(message);
      console.log(
        "Notificación enviada para",
        collectionId,
        context.params.docId,
      );
    } catch (err) {
      console.error("Error enviando notificación:", err);
    }

    return null;
  });
