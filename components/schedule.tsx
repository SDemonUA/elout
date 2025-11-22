"use client";

import { useState } from "react";
import { ScheduleInfo } from "../types";

const step = 15;

export default function Schedule({
  schedule,
}: {
  schedule: ScheduleInfo | null;
}) {
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
  if (!schedule) {
    return <div>No schedule available.</div>;
  }

  const formatedDate = new Date(schedule.scheduleDate).toLocaleDateString(
    "uk-UA",
    {
      dateStyle: "long",
    }
  );

  return (
    <div>
      <h2 className="text-2xl text-center font-semibold mb-1">
        Графік відключень на {formatedDate}
      </h2>
      <p className="mb-4 text-sm text-center text-gray-600">
        Оновлено:{" "}
        {new Date(schedule.date).toLocaleString("uk-UA", {
          dateStyle: "short",
          timeStyle: "short",
        })}
      </p>
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
                      ([startMin, endMin]) => time >= startMin && time < endMin
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

function getStoredGroup(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("selectedGroup");
}
