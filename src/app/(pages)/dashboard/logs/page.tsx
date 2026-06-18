import { Accordion } from "@/shared/ui/accordion";
import { LogItem } from "./ui/log-item";
import { getAutomationRuns } from "@entities/automation-run";

const StatsPage = async () => {
	const result = await getAutomationRuns();

	if (!result.success) {
		return (
			<div className="flex items-center justify-center">
				<p className="text-muted-foreground">Failed to load automation runs</p>
			</div>
		);
	}

	const logs = result.data;

	if (!logs || logs.length === 0) {
		return (
			<div className="flex items-center justify-center">
				<p className="text-muted-foreground">No automation runs found</p>
			</div>
		);
	}

	return (
		<>
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold tracking-tight">Schedule & Stats</h1>
			</div>

			<div className="mt-4 flex flex-col gap-4">
				<h2 className="text-xl font-semibold tracking-tight">Worker Logs</h2>

				<Accordion
					type="single"
					collapsible
					className="w-full space-y-2 border-none"
				>
					{logs.map((log) => (
						<LogItem key={log.id} log={log} />
					))}
				</Accordion>
			</div>
		</>
	);
};

export default StatsPage;
