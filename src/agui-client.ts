export type AGUIEvent = {
	type: string;
	component?: string;
	props?: Record<string, any>;
};

export function connectEventStream(onEvent: (evt: AGUIEvent) => void): EventSource {
	const evtSource = new EventSource("http://localhost:8000/agent/events");

	evtSource.onmessage = (e) => {
		if (e.data) {
			try {
				const json = JSON.parse(e.data);
				onEvent(json);
			} catch {
				console.warn("Evento non valido:", e.data);
			}
		}
	};

	evtSource.onerror = (err) => {
		console.error("Errore SSE:", err);
	};

	return evtSource;
}

export async function sendRun(): Promise<void> {
	await fetch("http://localhost:8000/agent/run", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ message: "Ciao agente!" }),
	});
}

export async function sendEvent(value: string): Promise<void> {
	await fetch("http://localhost:8000/agent/event", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ event: "action", value }),
	});
}
