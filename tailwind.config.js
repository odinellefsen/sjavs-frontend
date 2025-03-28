/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{html,js,svelte,ts}"],
	theme: {
		extend: {
			animation: {
				"fade-in-out": "fadeInOut 3s ease-in-out",
			},
			keyframes: {
				fadeInOut: {
					"0%": { opacity: "0" },
					"10%": { opacity: "1" },
					"80%": { opacity: "1" },
					"100%": { opacity: "0" },
				},
			},
		},
	},
	plugins: [],
};
