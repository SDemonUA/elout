"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams, useRouter } from "next/navigation";
import { ScheduleInfo } from "../types";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "./ui/card";
import { cn } from "@/lib/utils";
import Chip from "./chip";

const step = 30;

export default function Schedule({ schedule }: { schedule: ScheduleInfo }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedGroups = searchParams.get("groups")?.split(",") || [];

  function toggleGroupSelection(group: string) {
    let newSelectedGroups: string[];

    if (selectedGroups.includes(group)) {
      newSelectedGroups = selectedGroups.filter((g) => g !== group);
    } else {
      newSelectedGroups = [...selectedGroups, group];
      newSelectedGroups.sort();
    }
    const params = new URLSearchParams(searchParams.toString());
    if (newSelectedGroups.length > 0) {
      params.set("groups", newSelectedGroups.join(","));
    } else {
      params.delete("groups");
    }
    router.replace(`?${params.toString()}`);
  }

  function setView(view: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", view);
    router.replace(`?${params.toString()}`);
  }

  const groups = schedule ? Object.keys(schedule.schedule) : [];
  const groupsToDisplay = selectedGroups.length > 0 ? selectedGroups : groups;

  const durationFormat = new Intl.NumberFormat("uk", {
    style: "unit",
    unit: "hour",
    compactDisplay: "short",
    useGrouping: true,
  });

  return (
    <Tabs
      defaultValue="table"
      className="w-full"
      value={searchParams.get("view") || undefined}
      onValueChange={setView}
    >
      <TabsList className="m-auto">
        <TabsTrigger value="table">Таблиця</TabsTrigger>
        <TabsTrigger value="text">Текст</TabsTrigger>
        <TabsTrigger value="circle">Годинник</TabsTrigger>
      </TabsList>
      <div className="flex flex-wrap justify-center m-1 gap-2.5">
        {groups.map((group) => (
          <Chip
            key={group}
            onClick={() => toggleGroupSelection(group)}
            selected={selectedGroups.includes(group)}
          >
            {group}
          </Chip>
        ))}
      </div>
      <TabsContent value="table">
        <div
          className="grid"
          style={{
            gridTemplateColumns: `auto repeat(${groupsToDisplay.length}, 1fr)`,
          }}
        >
          <div key="head-time" className="bg-background sticky top-0"></div>
          {groupsToDisplay.map((group) => (
            <div
              key={`head-${group}`}
              className="p-1 text-center font-semibold even:bg-secondary bg-background sticky top-0"
            >
              {group}
            </div>
          ))}
          {groupsToDisplay.length % 2 === 0 ? <div className="hidden"></div> : null}

          {Array.from({ length: 24 * (60 / step) }, (_, i) => i * step).map((time) => {
            return [
              <div key={`r${step}-time`} className="font-mono text-right pr-1 py-0.5">
                {formatTime(time)}
              </div>,
              ...groupsToDisplay.map((group) => {
                const isOutage = schedule.schedule[group].some(
                  ([startMin, endMin]) => time >= startMin && time < endMin,
                );
                return (
                  <div
                    key={`r${step}-${group}`}
                    className={cn("even:bg-secondary bg-background", {
                      "bg-destructive/50!": isOutage,
                    })}
                  ></div>
                );
              }),
              groupsToDisplay.length % 2 === 0 ? <div className="hidden"></div> : null,
            ];
          })}
        </div>
      </TabsContent>
      <TabsContent value="text">
        <div className="grid gap-3 grid-cols-[repeat(auto-fit,minmax(12rem,1fr))]">
          {groupsToDisplay.map((group) => {
            const ranges = schedule.schedule[group];
            return (
              <Card key={group} className="text-center pb-2">
                <CardHeader>
                  <CardTitle>Група {group}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="font-mono">
                    {ranges.map(([startMin, endMin], index) => (
                      <li key={index}>
                        {formatTime(startMin)} - {formatTime(endMin)}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="text-right text-xs justify-end">
                  Всього без світла{" "}
                  {durationFormat.format(
                    ranges.reduce((acc, [startMin, endMin]) => acc + (endMin - startMin), 0) / 60,
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </TabsContent>
      <TabsContent value="circle">
        <TimeCircle schedule={schedule} groupsToDisplay={selectedGroups.slice(0, 3)} />
      </TabsContent>
    </Tabs>
  );
}

function TimeCircle({
  schedule,
  groupsToDisplay,
}: {
  schedule: ScheduleInfo;
  groupsToDisplay: string[];
}) {
  const size = 600;
  const center = size / 2;
  const radius = 220;
  const innerRadius = 200;
  const markLength = 15;
  const halfMarkLength = 8;

  const colors = ["hsl(0, 70%, 50%)", "hsl(210, 70%, 50%)", "hsl(120, 50%, 45%)"];

  function polarToCartesian(angle: number, r: number): [number, number] {
    const angleInRadians = ((angle - 90) * Math.PI) / 180;
    return [center + r * Math.cos(angleInRadians), center + r * Math.sin(angleInRadians)];
  }

  function describeArc(startAngle: number, endAngle: number, r: number): string {
    const start = polarToCartesian(startAngle, r);
    const end = polarToCartesian(endAngle, r);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return `M ${start[0]} ${start[1]} A ${r} ${r} 0 ${largeArcFlag} 1 ${end[0]} ${end[1]}`;
  }

  return (
    <div className="flex justify-center items-center p-4">
      <svg viewBox={`0 0 ${size} ${size}`} className="max-w-full h-auto">
        {/* Main circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="url(#gradient)"
          stroke="currentColor"
          strokeWidth="2"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#000055" />
            <stop offset="40%" stopColor="#ffffff" />
            <stop offset="60%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#FFC000" />
          </linearGradient>
        </defs>

        {groupsToDisplay.length === 0 && (
          <text
            x={center}
            y={center}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-lg font-medium"
            fill="currentColor"
          >
            Виберіть групу для відображення
          </text>
        )}

        {/* Hour and half-hour marks */}
        {Array.from({ length: 48 }, (_, i) => {
          const angle = (i * 360) / 48;
          const isHourMark = i % 2 === 0;
          const hour = i / 2;
          const markLen = isHourMark ? markLength : halfMarkLength;

          const outerPoint = polarToCartesian(angle, radius);
          const innerPoint = polarToCartesian(angle, radius + markLen);

          return (
            <g key={`mark-${i}`}>
              {/* Mark line */}
              <line
                x1={outerPoint[0]}
                y1={outerPoint[1]}
                x2={innerPoint[0]}
                y2={innerPoint[1]}
                stroke="currentColor"
                strokeWidth={isHourMark ? "2" : "1"}
              />
              {/* Hour number */}
              {isHourMark && (
                <text
                  x={polarToCartesian(angle, radius + markLen + 20)[0]}
                  y={polarToCartesian(angle, radius + markLen + 20)[1]}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-sm font-medium"
                  fill="currentColor"
                >
                  {hour.toString()}
                </text>
              )}
            </g>
          );
        })}

        {/* Outage arcs for each group */}
        {groupsToDisplay.map((group, groupIndex) => {
          const ranges = schedule.schedule[group];
          const color = colors[groupIndex % colors.length];
          const arcRadius = innerRadius - groupIndex * 20;

          return ranges.map(([startMin, endMin], rangeIndex) => {
            const startAngle = (startMin / (24 * 60)) * 360;
            const endAngle = (endMin / (24 * 60)) * 360;

            return (
              <path
                key={`${group}-${rangeIndex}`}
                d={describeArc(startAngle, endAngle, arcRadius)}
                stroke={color}
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
              />
            );
          });
        })}

        {/* Legend */}
        {groupsToDisplay.map((group, index) => {
          const color = colors[index % colors.length];
          const y = 20 + index * 25;
          return (
            <g key={`legend-${group}`}>
              <line
                x1={20}
                y1={y}
                x2={50}
                y2={y}
                stroke={color}
                strokeWidth="8"
                strokeLinecap="round"
              />
              <text
                x={60}
                y={y}
                dominantBaseline="middle"
                className="text-sm font-medium"
                fill="currentColor"
              >
                Група {group}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function formatTime(minutes: number) {
  const hour = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0");
  const minute = (minutes % 60).toString().padStart(2, "0");
  return `${hour}:${minute}`;
}
