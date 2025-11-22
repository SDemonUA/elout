"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScheduleInfo } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const step = 30;

export default function Schedule({ schedule }: { schedule: ScheduleInfo }) {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(
    getStoredGroup()
  );

  function toggleGroupSelection(group: string) {
    const newGroup = selectedGroup === group ? null : group;
    setSelectedGroup(newGroup);
    if (newGroup === null) localStorage.removeItem("selectedGroup");
    else localStorage.setItem("selectedGroup", newGroup);
  }

  const groups = schedule ? Object.keys(schedule.schedule) : [];

  return (
    <Tabs defaultValue="table" className="w-full">
      <TabsList className="m-auto">
        <TabsTrigger value="table">Таблиця</TabsTrigger>
        <TabsTrigger value="text">Текст</TabsTrigger>
      </TabsList>
      <TabsContent value="table">
        <table className="table-fixed max-w-3xl w-full text-center">
          <thead>
            <tr>
              <th className="w-16"></th>
              {groups.map((group) => (
                <th
                  key={group}
                  className="p-1 dark:aria-selected:bg-white/15 aria-selected:bg-black/15 cursor-pointer "
                  data-group={group}
                  aria-selected={selectedGroup === group || undefined}
                  onClick={() => toggleGroupSelection(group)}
                >
                  {group}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 24 * (60 / step) }, (_, i) => i * step).map(
              (time) => {
                return (
                  <tr key={time} className="has-aria-[selected]:*:opacity-50">
                    <td className="font-mono">{formatTime(time)}</td>
                    {groups.map((group) => {
                      const isActive = schedule.schedule[group].some(
                        ([startMin, endMin]) =>
                          time >= startMin && time < endMin
                      );
                      return (
                        <td
                          key={group}
                          aria-selected={selectedGroup === group || undefined}
                          data-group={group}
                          className="aria-selected:opacity-100"
                          onClick={() => toggleGroupSelection(group)}
                          style={{
                            backgroundColor: !isActive
                              ? "lightgreen"
                              : "lightcoral",
                          }}
                        >
                          {isActive ? "●" : "○"}
                        </td>
                      );
                    })}
                  </tr>
                );
              }
            )}
          </tbody>
        </table>
      </TabsContent>
      <TabsContent value="text">
        <div className="grid gap-3 grid-cols-[repeat(auto-fit,minmax(12rem,1fr))]">
          {groups.map((group) => {
            const ranges = schedule.schedule[group];
            return (
              <Card
                key={group}
                aria-selected={selectedGroup === group || undefined}
                data-group={group}
                onClick={() => toggleGroupSelection(group)}
                className="cursor-pointer aria-selected:bg-secondary text-center"
              >
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

function getStoredGroup(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("selectedGroup");
}
