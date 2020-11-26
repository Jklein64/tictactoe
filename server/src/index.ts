import ws from "ws"
import express from "express"
import { createServer, IncomingMessage } from "http"
import { Socket } from "net"
import { PlayerState, TileState } from "./enums"
import path from "path"

const app = express()
const server = createServer(app)
const wsserver = new ws.Server({ server })

app.use("/", express.static(path.join(__dirname, "../../client/build/")))

app.get("/", (req: any, res: any) => {
	res.sendFile(path.join(__dirname, "../../client/build/index.html"))
})

app.on("upgrade", (request: IncomingMessage, socket: Socket, head: Buffer) => {
	wsserver.handleUpgrade(request, socket, head, client => {
		console.log("upgraded client")
		wsserver.emit("connection", client, request)
	})
})

type Payload<T extends "board" | "player"> = {
	type: T
	body: T extends "board" ? TileState[] : T extends "player" ? PlayerState : unknown
}

function isBoard(payload: Payload<"board" | "player">): payload is Payload<"board"> {
	return payload.type === "board"
}

function isPlayer(payload: Payload<"board" | "player">): payload is Payload<"player"> {
	return payload.type === "player"
}

wsserver.on("connection", (socket: ws) => {
	console.log(wsserver.clients.size)
	socket.on("message", (raw: ws.Data) => {
		const data = (() => {
			try {
				return JSON.parse(raw as string)
			} catch (error) {
				return raw
			}
		})() as Payload<"board" | "player">

		if (isBoard(data)) {
			wsserver.clients.forEach(client => {
				if (client.readyState === ws.OPEN) {
					client.send(JSON.stringify({ type: "board", body: data.body }))
				}
			})
		} else if (isPlayer(data)) {
			if (data.body === PlayerState.None) {
				// if one player resets, all others should
				wsserver.clients.forEach(client => {
					if (client !== socket && client.readyState === ws.OPEN) {
						client.send(JSON.stringify({ type: "player", body: PlayerState.None }))
						client.send(JSON.stringify({ type: "board", body: new Array(9).fill(TileState.Empty) }))
					}
				})
			}
		}
	})
})

server.listen(process.env.PORT || 8000, () => {
	console.log("Listening!")
})
