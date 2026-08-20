import { useEffect, useState } from "react";
import { AGUIRenderer } from "@agui/react";
import { connectEventStream, sendRun, sendEvent, AGUIEvent } from "./agui-client";

const COMPONENTS = [
	"text", "buttons", "actions", "card", "list", "select",
	"form", "checkbox", "grid", "table", "image", "modal",
	"progress", "input", "file", "wizard"
];

export default function App() {
	const [events, setEvents] = useState<AGUIEvent[]>([]);
	const [currentEvent, setCurrentEvent] = useState<AGUIEvent | null>(null);

	useEffect(() => {
		const stream = connectEventStream((evt) => {
			setEvents((prev) => [...prev, evt]);
			setCurrentEvent(evt);
		});

		return () => stream.close();
	}, []);

	async function testAll() {
		await sendRun();
		for (const c of COMPONENTS) {
			await sendEvent(c);
			await new Promise((r) => setTimeout(r, 800));
		}
	}

	async function testSingle(c: string) {
		if (!c) return;
		await sendRun();
		await new Promise((r) => setTimeout(r, 300));
		await sendEvent(c);
	}

	return (
		<div style={{ padding: "20px", fontFamily: "sans-serif" }}>
			<h1>AG-UI Client React (TypeScript)</h1>

			<div style={{ marginBottom: "20px" }}>
				<button onClick={testAll}>Test automatico</button>

				<select
					onChange={(e) => testSingle(e.target.value)}
					defaultValue=""
					style={{ marginLeft: "10px" }}
				>
					<option value="" disabled>Test singolo componente</option>
					{COMPONENTS.map((c) => (
						<option key={c} value={c}>{c}</option>
					))}
				</select>
			</div>

			<h2>Eventi ricevuti</h2>
			<pre style={{
				background: "#eee",
				padding: "10px",
				height: "200px",
				overflow: "auto"
			}}>
				{JSON.stringify(events, null, 2)}
			</pre>

			<h2>Rendering AG-UI</h2>
			<div style={{ border: "1px solid #ccc", padding: "20px" }}>
				{currentEvent && (
					<AGUIRenderer event={currentEvent} />
				)}
			</div>
		</div>
	);
}
