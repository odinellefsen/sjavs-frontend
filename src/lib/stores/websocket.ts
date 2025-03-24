import { writable } from "svelte/store";
import { user } from "./clerk";
import { get } from "svelte/store";

export interface WSMessage {
	event: string;
	data: {
		message?: string;
		status?: string;
		[key: string]: unknown;
	};
}

const WS_URL = "ws://192.168.1.185:3000/ws";

function createWebSocketStore() {
	const { subscribe, set, update } = writable<{
		connected: boolean;
		messages: WSMessage[];
		gameState: "waiting" | "playing" | null;
	}>({
		connected: false,
		messages: [],
		gameState: null,
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

			ws.onopen = () => {
				update((state) => ({ ...state, connected: true }));
				console.log("Connected to WebSocket");
			};

			ws.onclose = () => {
				update((state) => ({ ...state, connected: false }));
				console.log("Disconnected from WebSocket");

				if (retries > 0) {
					setTimeout(() => connect(retries - 1), 2000);
				}
			};

			ws.onmessage = (event) => {
				console.log("Received message:", event.data);
				const message = JSON.parse(event.data);
				update((state) => ({
					...state,
					messages: [...state.messages, message],
				}));

				if (message.event === "joined") {
					update((state) => ({
						...state,
						gameState: message.data.status as "waiting" | "playing",
					}));
				}
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
