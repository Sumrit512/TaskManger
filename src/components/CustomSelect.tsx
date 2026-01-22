"use client";

import { Listbox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";

export default function CustomSelect({
  value,
  options,
  onChange,
  className = "",
}: {
  value: string;
  options: { label: string; value: string }[];
  onChange: (val: string) => void;
  className?: string;
}) {
  return (
    <Listbox value={value} onChange={onChange}>
      <div className={clsx("relative mt-1 w-full", className)}>
        <Listbox.Button
          className="
            relative w-full cursor-pointer rounded-xl
            border border-gray-300/70 dark:border-white/10
            bg-transparent px-4 py-2.5 text-sm
            dark:text-white
            outline-none focus:ring-2 focus:ring-indigo-500/40
            transition text-left
          "
        >
          <span className="block truncate">
            {options.find((o) => o.value === value)?.label || "Select"}
          </span>

          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
          </span>
        </Listbox.Button>

        <Listbox.Options
          className="
            absolute z-50 mt-2 max-h-60 w-full overflow-auto
            rounded-xl bg-white dark:bg-slate-900
            border border-black/10 dark:border-white/10
            py-1 text-sm shadow-xl backdrop-blur-xl
            focus:outline-none
          "
        >
          {options.map((opt) => (
            <Listbox.Option
              key={opt.value}
              value={opt.value}
              className={({ active }) =>
                `cursor-pointer select-none px-4 py-2 transition ${
                  active
                    ? "bg-indigo-600 text-white"
                    : "text-gray-700 dark:text-gray-200"
                }`
              }
            >
              {({ selected }) => (
                <div className="flex items-center justify-between">
                  <span className={selected ? "font-medium" : "font-normal"}>
                    {opt.label}
                  </span>
                  {selected && (
                    <CheckIcon className="h-4 w-4 text-indigo-300" />
                  )}
                </div>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
  );
}
