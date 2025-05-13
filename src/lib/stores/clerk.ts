import { Clerk } from "@clerk/clerk-js";
import { writable } from "svelte/store";

// Replace with your actual Clerk publishable key
const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

interface ClerkUser {
	id: string;
	sessionId: string;
	session?: {
		getToken(options?: { template?: string }): Promise<string | null>;
	};
	username?: string;
}

export const clerk = writable<Clerk | null>(null);
export const user = writable<ClerkUser | null>(null);

export async function initClerk() {
	const clerkInstance = new Clerk(CLERK_PUBLISHABLE_KEY);
	await clerkInstance.load();

	clerk.set(clerkInstance);

	// Set initial user with type assertion and include session
	const currentUser = clerkInstance.user;
	const session = clerkInstance.session;

	user.set(
		currentUser
			? {
					id: currentUser.id,
					sessionId: session?.id || "",
					session: session || undefined,
					username: currentUser.username || "",
				}
			: null,
	);

	clerkInstance.addListener((state) => {
		user.set(
			state.user
				? {
						id: state.user.id,
						sessionId: state.session?.id || "",
						session: state.session || undefined,
						username: state.user.username || "",
					}
				: null,
		);
	});
}
