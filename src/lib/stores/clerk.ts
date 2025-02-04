import { Clerk } from "@clerk/clerk-js";
import { writable } from "svelte/store";

// Replace with your actual Clerk publishable key
const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

interface ClerkUser {
	id: string;
	sessionId: string;
	signOut: () => Promise<void>;
}

export const clerk = writable<Clerk | null>(null);
export const user = writable<ClerkUser | null>(null);

export async function initClerk() {
	const clerkInstance = new Clerk(CLERK_PUBLISHABLE_KEY);
	await clerkInstance.load();

	clerk.set(clerkInstance);

	// Set initial user with type assertion
	user.set(clerkInstance.user as ClerkUser | null);

	// Update user store when auth state changes
	clerkInstance.addListener((state) => {
		user.set(state.user as ClerkUser | null);
	});
}
