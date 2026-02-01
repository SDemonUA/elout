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
                  ([startMin, endMin]) => time >= startMin && time < endMin
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
                    ranges.reduce((acc, [startMin, endMin]) => acc + (endMin - startMin), 0) / 60
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </TabsContent>
    </Tabs>
  );
}

function formatTime(minutes: number) {
  const hour = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0");
  const minute = (minutes % 60).toString().padStart(2, "0");
  return `${hour}:${minute}`;
}
