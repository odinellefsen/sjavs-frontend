import { writable } from "svelte/store";
import { user } from "./clerk";
import { get } from "svelte/store";

export interface WSMessage {
	event: string;
	data: unknown;
}

function createWebSocketStore() {
	const { subscribe, set, update } = writable<{
		connected: boolean;
		messages: WSMessage[];
	}>({
		connected: false,
		messages: [],
	});

	let ws: WebSocket;

	function connect(retries = 5) {
		ws = new WebSocket("ws://localhost:3000/ws");

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
