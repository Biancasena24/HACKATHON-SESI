import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { format, parseISO } from "date-fns";
import type { Checkin } from "@/lib/viva/queries";
import { daysAgoStr } from "@/lib/viva/dates";

export function WellbeingChart({ checkins, days = 14 }: { checkins: Checkin[]; days?: number }) {
  const start = daysAgoStr(days - 1);
  const map = new Map(checkins.filter((c) => c.day >= start).map((c) => [c.day, c]));
  const data = Array.from({ length: days }, (_, i) => {
    const day = daysAgoStr(days - 1 - i);
    const c = map.get(day);
    return { day: format(parseISO(day), "dd/MM"), Humor: c?.mood ?? null, Energia: c?.energy ?? null, Sono: c?.sleep ?? null };
  });
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
          <defs>
            <linearGradient id="gMood" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.35} />
              <stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--border)" vertical={false} />
          <XAxis dataKey="day" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
          <YAxis domain={[1, 5]} ticks={[1, 3, 5]} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)" }} />
          <Area type="monotone" dataKey="Humor" stroke="var(--chart-2)" strokeWidth={3} fill="url(#gMood)" connectNulls dot={{ r: 3 }} />
          <Area type="monotone" dataKey="Energia" stroke="var(--chart-3)" strokeWidth={2.5} fill="transparent" connectNulls dot={false} />
          <Area type="monotone" dataKey="Sono" stroke="var(--chart-1)" strokeWidth={2} strokeDasharray="4 4" fill="transparent" connectNulls dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
