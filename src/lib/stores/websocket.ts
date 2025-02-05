import { writable } from "svelte/store";
import { user } from "./clerk";
import { get } from "svelte/store";

export interface WSMessage {
	event: string;
	data: unknown;
}

const WS_URL = "ws://127.0.0.1:3000/ws";

function createWebSocketStore() {
	const { subscribe, set, update } = writable<{
		connected: boolean;
		messages: WSMessage[];
	}>({
		connected: false,
		messages: [],
	});

	let ws: WebSocket;

	async function connect(retries = 5) {
		const currentUser = get(user);
		if (!currentUser?.session) {
			console.error("Must be signed in to connect");
			return;
		}

		try {
			const token = await currentUser.session.getToken();
			ws = new WebSocket(`${WS_URL}?token=${token}`);

			// Or if you prefer using headers (some WebSocket servers support this)
			// ws = new WebSocket("ws://localhost:3000/ws", {
			//   headers: {
			//     Authorization: `Bearer ${token}`
			//   }
			// });

			ws.onopen = () => {
				update((state) => ({ ...state, connected: true }));
				console.log("Connected to WebSocket");
			};

			ws.onclose = () => {
				update((state) => ({ ...state, connected: false }));
				console.log("Disconnected from WebSocket");

				// Attempt to reconnect with a limit
				if (retries > 0) {
					setTimeout(() => connect(retries - 1), 2000);
				}
			};

			ws.onmessage = (event) => {
				const message = JSON.parse(event.data);
				update((state) => ({
					...state,
					messages: [...state.messages, message],
				}));
			};

			ws.onerror = (error) => {
				console.error("WebSocket error details:", {
					readyState: ws.readyState,
					url: ws.url,
					protocol: ws.protocol,
					error,
				});
			};
		} catch (error) {
			console.error("Failed to get authentication token:", error);
			if (retries > 0) {
				setTimeout(() => connect(retries - 1), 2000);
			}
		}
	}

	function sendMessage(event: string, data: unknown = {}) {
		const currentUser = get(user);
		if (!currentUser) {
			console.error("Must be signed in to send messages");
			return;
		}

		console.log("Sending message:", event, data);
		if (ws && ws.readyState === WebSocket.OPEN) {
			ws.send(
				JSON.stringify({
					event,
					data,
					userId: currentUser.id,
					sessionId: currentUser.sessionId,
				}),
			);
		} else {
			console.error("WebSocket is not connected");
		}
	}

	return {
		subscribe,
		connect,
		sendMessage,
		disconnect: () => ws?.close(),
	};
}

export const wsStore = createWebSocketStore();
