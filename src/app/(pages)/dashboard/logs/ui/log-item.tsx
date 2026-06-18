import {
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/shared/ui/accordion";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Separator } from "@/shared/ui/separator";
import {
	RiCheckLine,
	RiCloseLine,
	RiDownloadLine,
	RiFileListLine,
} from "@remixicon/react";
import {
	Automation,
	AutomationRun,
	AutomationRunStatus,
} from "@prisma/generated/client";

export async function LogItem({
	log,
}: {
	log: {
		automation: Automation;
	} & AutomationRun;
}) {
	const isSuccess = log.status === AutomationRunStatus.success;
	const isSkipped = log.status === AutomationRunStatus.skipped;

	const statusIcon = isSuccess ? (
		<RiCheckLine className="size-4" />
	) : isSkipped ? (
		<RiDownloadLine className="size-4" />
	) : (
		<RiCloseLine className="size-4" />
	);

	const statusColor = isSuccess
		? "bg-emerald-500/10 text-emerald-500"
		: isSkipped
			? "bg-amber-500/10 text-amber-500"
			: "bg-red-500/10 text-red-500";

	return (
		<AccordionItem
			value={log.id}
			className="border-border bg-card ring-border/50 overflow-hidden rounded-xl border data-[state=open]:ring-1"
		>
			<AccordionTrigger className="hover:bg-muted/50 mr-4 flex flex-1 items-center justify-between gap-4 border-transparent px-4 py-3 transition-colors hover:no-underline">
				<div className="flex items-center gap-3">
					<div
						className={`flex h-8 w-8 items-center justify-center rounded-full ${statusColor}`}
					>
						{statusIcon}
					</div>
					<span className="font-semibold">{log.automation.name}</span>
				</div>
				<div className="text-muted-foreground mr-6 flex items-center gap-4 text-sm font-normal">
					<span className="hidden sm:inline-block">{log.retries} retries</span>
					<span className="hidden sm:inline-block">
						{log.scheduledAt?.toLocaleString()}
					</span>
					<Badge
						variant={
							isSuccess ? "default" : isSkipped ? "secondary" : "destructive"
						}
						className="capitalize"
					>
						{log.status}
					</Badge>
				</div>
			</AccordionTrigger>

			<AccordionContent className="border-border mt-1 flex flex-col gap-6 border-t p-4 text-sm lg:flex-row">
				{/* Left: Terminal output */}
				<div className="min-w-0 flex-1 space-y-3">
					<span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
						Terminal Output
					</span>
					<div className="custom-scrollbar max-h-75 overflow-y-auto rounded-lg border border-zinc-800 bg-zinc-950 p-4 font-mono text-xs whitespace-pre-wrap text-zinc-50 shadow-inner dark:bg-zinc-900">
						{log.logs}
					</div>
				</div>

				{/* Right: Info panel */}
				<div className="bg-muted/40 border-border/50 flex h-fit w-full flex-col gap-5 rounded-xl border p-5 lg:w-72">
					<div className="grid grid-cols-2 gap-x-4 gap-y-5">
						<div className="flex flex-col gap-1.5">
							<span className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
								Scheduled At
							</span>
							<span className="text-sm font-medium">
								{log?.scheduledAt?.toLocaleString() ?? "—"}
							</span>
						</div>
						<div className="flex flex-col gap-1.5">
							<span className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
								Duration
							</span>
							<span className="text-sm font-medium">{log.durationMs}</span>
						</div>
						<div className="flex flex-col gap-1.5">
							<span className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
								Provider
							</span>
							<span className="text-sm font-medium capitalize">
								{log.automation.provider}
							</span>
						</div>
						<div className="flex flex-col gap-1.5">
							<span className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
								Status
							</span>
							<span className="text-sm font-medium capitalize">
								{log.status}
							</span>
						</div>
						<div className="flex flex-col gap-1.5">
							<span className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
								Started At
							</span>
							<span className="text-sm font-medium">
								{log.startedAt?.toLocaleString() ?? "—"}
							</span>
						</div>
						<div className="flex flex-col gap-1.5">
							<span className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
								Finished At
							</span>
							<span className="text-sm font-medium">
								{log.finishedAt?.toLocaleString() ?? "—"}
							</span>
						</div>
						<div className="flex flex-col gap-1.5">
							<span className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
								Automation ID
							</span>
							<span className="font-mono text-xs font-medium">
								{log.automationId}
							</span>
						</div>
						<div className="flex flex-col gap-1.5">
							<span className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
								Retry Attempts
							</span>
							<span className="text-sm font-medium">{log.retries}</span>
						</div>
					</div>

					<Separator />

					<div className="flex flex-col gap-2.5">
						<Button size="sm" className="w-full justify-start gap-2 shadow-sm">
							<RiFileListLine className="size-4" />
							View Full Log
						</Button>
						<Button
							variant="outline"
							size="sm"
							className="w-full justify-start gap-2"
						>
							<RiDownloadLine className="size-4" />
							Download
						</Button>
					</div>
				</div>
			</AccordionContent>
		</AccordionItem>
	);
}
export default LogItem;
