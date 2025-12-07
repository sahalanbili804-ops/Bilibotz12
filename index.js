import makeWASocket, {
   useMultiFileAuthState,
   DisconnectReason
} from "@whiskeysockets/baileys"
import pino from "pino"

async function startBot() {
   const { state, saveCreds } = await useMultiFileAuthState("./session")
   const sock = makeWASocket({
      logger: pino({ level: "silent" }),
      printQRInTerminal: true,
      auth: state
   })

   sock.ev.on("creds.update", saveCreds)

   sock.ev.on("messages.upsert", async ({ messages }) => {
      const msg = messages[0]
      if (!msg.message) return

      const chat = msg.key.remoteJid
      const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text

      if (text === "ping") {
         await sock.sendMessage(chat, { text: "pong!" })
      }
   })
}

startBot()
