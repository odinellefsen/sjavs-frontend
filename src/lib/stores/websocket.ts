import { writable } from "svelte/store";
import { user, clerk } from "./clerk";
import { get } from "svelte/store";

export interface WSMessage {
	event: string;
	data: {
		message?: string;
		status?: string;
		[key: string]: unknown;
	};
}

export interface Player {
	id: string;
	username: string;
}

const WS_URL = "ws://192.168.1.185:3000/ws";

function createWebSocketStore() {
	const { subscribe, set, update } = writable<{
		connected: boolean;
		messages: WSMessage[];
		gameState: "waiting" | "playing" | null;
		players: Player[];
	}>({
		connected: false,
		messages: [],
		gameState: null,
		players: [],
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
				update((state) => ({
					...state,
					connected: false,
					players: [], // Clear players list on disconnect
				}));
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
					const clerkInstance = get(clerk);
					const userId = get(user)?.id || "";

					// Get the firstname or email from clerk if available
					let username = "Player";
					if (clerkInstance?.user) {
						username = clerkInstance.user.firstName || username;

						// Try to get email if firstName is not available
						if (!username && clerkInstance.user.emailAddresses?.length > 0) {
							const email = clerkInstance.user.emailAddresses[0].emailAddress;
							if (email) username = email;
						}
					}

					update((state) => {
						// Add the current user to the players list
						const currentPlayer = {
							id: userId,
							username: username,
						};

						// Check if the current player is already in the list
						const playerExists = state.players.some(
							(p) => p.id === currentPlayer.id,
						);

						return {
							...state,
							gameState: message.data.status as "waiting" | "playing",
							players: playerExists
								? state.players
								: [...state.players, currentPlayer],
						};
					});
				}

				if (message.event === "player_joined") {
					update((state) => {
						const newPlayer = {
							id: message.data.player_id,
							username: message.data.username,
						};

						// Check if player already exists to avoid duplicates
						const playerExists = state.players.some(
							(p) => p.id === newPlayer.id,
						);

						return {
							...state,
							players: playerExists
								? state.players
								: [...state.players, newPlayer],
						};
					});
				}

				if (message.event === "player_left") {
					update((state) => {
						// Remove the player from the list
						return {
							...state,
							players: state.players.filter(
								(p) => p.id !== message.data.player_id,
							),
						};
					});
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
