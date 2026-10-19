import type { ReactNode } from "react";

import type { WalkthroughStep } from "@/content/site";

/*
 * Small HTML diagrams that explain how each part of What's Happening Australia
 * works. They are deliberately schematic and labelled "Diagram": no real
 * customer data and no invented figures.
 */

function Frame({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex h-full flex-col gap-5 rounded-lg border border-rule bg-surface p-5 sm:p-7">
      <div className="flex items-center justify-between gap-4 text-small text-muted">
        <span>{label}</span>
        <span className="rounded-full border border-rule px-2.5 py-0.5">Diagram</span>
      </div>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col justify-center">{children}</div>
    </div>
  );
}

function BookingDiagram() {
  const slots = [
    { time: "09:00", state: "Booked", tone: "muted" },
    { time: "09:30", state: "Locked while customer A pays · expires in 15 min", tone: "accent" },
    { time: "10:00", state: "Free", tone: "free" },
    { time: "10:30", state: "Free", tone: "free" },
  ] as const;
  return (
    <Frame label="One staff member, one morning">
      <ul className="grid gap-2">
        {slots.map((slot) => (
          <li key={slot.time} className="grid grid-cols-[4rem_1fr] items-center gap-3 text-small">
            <span className="tabular-nums text-muted">{slot.time}</span>
            <span
              className={
                slot.tone === "accent"
                  ? "rounded-md border border-accent px-3 py-2 text-ink"
                  : slot.tone === "muted"
                    ? "rounded-md bg-rule/70 px-3 py-2 text-muted"
                    : "rounded-md border border-dashed border-rule px-3 py-2 text-muted"
              }
            >
              {slot.state}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-5 border-t border-rule pt-4 text-small text-muted">
        Customer B asks for 09:30 at the same moment. The unique index on business, staff member and time rejects the
        second lock, so B is offered 10:00 instead.
      </p>
    </Frame>
  );
}

function SchedulingDiagram() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  type Cell = "shift" | "change" | "off" | "none";
  const rows: { name: string; cells: Cell[] }[] = [
    { name: "Staff 1", cells: ["shift", "shift", "shift", "change", "shift", "none", "none"] },
    { name: "Staff 2", cells: ["none", "shift", "shift", "shift", "off", "shift", "shift"] },
    { name: "Staff 3", cells: ["shift", "off", "shift", "shift", "shift", "shift", "none"] },
  ];
  const cellClass: Record<Cell, string> = {
    shift: "bg-ink/80",
    change: "bg-accent",
    off: "border border-dashed border-muted/60",
    none: "",
  };
  return (
    <Frame label="One week for three staff members">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[20rem] border-separate border-spacing-1 text-small">
          <thead>
            <tr>
              <th className="w-20" />
              {days.map((day) => (
                <th key={day} scope="col" className="pb-1 text-center font-medium text-muted">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.name}>
                <th scope="row" className="pr-2 text-left font-medium text-muted">
                  {row.name}
                </th>
                {row.cells.map((cell, index) => (
                  <td key={index} className="h-9">
                    <span className={`block h-full rounded ${cellClass[cell]}`} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-rule pt-4 text-small text-muted">
        <li className="flex items-center gap-2">
          <span className="size-3 rounded-sm bg-ink/80" /> Weekly shift
        </li>
        <li className="flex items-center gap-2">
          <span className="size-3 rounded-sm bg-accent" /> One-off change
        </li>
        <li className="flex items-center gap-2">
          <span className="size-3 rounded-sm border border-dashed border-muted/60" /> Day off
        </li>
      </ul>
    </Frame>
  );
}

function TicketingDiagram() {
  const steps = [
    { title: "Choose tickets", note: "Ticket type and promo code" },
    { title: "Held for 5 minutes", note: "Nobody else can buy these seats" },
    { title: "Paid with Stripe", note: "Webhook signature verified" },
    { title: "QR ticket issued", note: "Receipt as a PDF" },
    { title: "Checked in", note: "Scanned at the door" },
  ];
  return (
    <Frame label="From choosing a ticket to the door">
      <ol className="grid gap-2">
        {steps.map((step, index) => (
          <li key={step.title} className="grid grid-cols-[1.75rem_1fr] items-start gap-3">
            <span
              className={`mt-0.5 grid size-7 place-items-center rounded-full border text-small tabular-nums ${
                index === 1 ? "border-accent text-accent" : "border-rule text-muted"
              }`}
            >
              {index + 1}
            </span>
            <span className="rounded-md border border-rule px-3 py-2">
              <span className="block font-medium">{step.title}</span>
              <span className="block text-small text-muted">{step.note}</span>
            </span>
          </li>
        ))}
      </ol>
      <p className="mt-5 border-t border-rule pt-4 text-small text-muted">
        If payment does not finish, the hold expires and the seats go back on sale.
      </p>
    </Frame>
  );
}

function AnalyticsDiagram() {
  // Relative bar heights only: this is the dashboard's layout, not real data.
  const bars = [0.45, 0.62, 0.38, 0.8, 0.55, 0.92, 0.7];
  return (
    <Frame label="A business's dashboard, as laid out">
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-md border border-rule p-3">
          <p className="text-small text-muted">Today</p>
          <p className="mt-2 h-2 w-2/3 rounded bg-rule" />
          <p className="mt-2 h-2 w-1/2 rounded bg-rule" />
        </div>
        <div className="rounded-md border border-rule p-3">
          <p className="text-small text-muted">Next 7 days</p>
          <p className="mt-2 h-2 w-3/4 rounded bg-rule" />
          <p className="mt-2 h-2 w-1/3 rounded bg-rule" />
        </div>
        <div className="col-span-2 rounded-md border border-rule p-3">
          <p className="text-small text-muted">Appointments and paid sales, last 7 days</p>
          <div className="mt-3 flex h-24 items-end gap-2" aria-hidden="true">
            {bars.map((height, index) => (
              <span
                key={index}
                className={`flex-1 rounded-t ${index === bars.length - 1 ? "bg-accent" : "bg-ink/70"}`}
                style={{ height: `${height * 100}%` }}
              />
            ))}
          </div>
        </div>
        <div className="col-span-2 rounded-md border border-rule p-3">
          <p className="text-small text-muted">Ticket redemptions per event</p>
          <p className="mt-2 h-2 w-5/6 rounded bg-rule" />
        </div>
      </div>
      <p className="mt-4 text-small text-muted">Bar heights show the shape of the chart only, not real figures.</p>
    </Frame>
  );
}

function MobileDiagram() {
  return (
    <Frame label="One backend, two apps">
      <div className="grid grid-cols-[auto_1fr] items-center gap-6 sm:gap-8">
        <div className="relative h-52 w-28 rounded-[1.4rem] border-2 border-ink/70 p-2.5 sm:h-60 sm:w-32">
          <span className="mx-auto mb-3 block h-1.5 w-10 rounded-full bg-rule" />
          <span className="block h-16 rounded-md bg-rule" />
          <span className="mt-2 block h-2 w-3/4 rounded bg-rule" />
          <span className="mt-1.5 block h-2 w-1/2 rounded bg-rule" />
          <span className="mt-4 block h-7 rounded-full bg-accent/80" />
        </div>
        <ul className="grid gap-2 text-small">
          <li className="rounded-md border border-rule px-3 py-2">
            <span className="block font-medium">Versioned mobile API</span>
            <span className="text-muted">Same database and rules as the website</span>
          </li>
          <li className="rounded-md border border-rule px-3 py-2">
            <span className="block font-medium">Short-lived access token</span>
            <span className="text-muted">Checked on every request</span>
          </li>
          <li className="rounded-md border border-accent px-3 py-2">
            <span className="block font-medium">Refresh token rotates on use</span>
            <span className="text-muted">Stored hashed, revocable per device</span>
          </li>
        </ul>
      </div>
    </Frame>
  );
}

const diagrams: Record<WalkthroughStep["id"], () => ReactNode> = {
  booking: BookingDiagram,
  scheduling: SchedulingDiagram,
  ticketing: TicketingDiagram,
  analytics: AnalyticsDiagram,
  mobile: MobileDiagram,
};

export function StepDiagram({ id }: { id: WalkthroughStep["id"] }) {
  const Diagram = diagrams[id];
  return <Diagram />;
}
