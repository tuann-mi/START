import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export function randomIndex(length: number) {
  return Math.floor(Math.random() * length);
}

export function createColorMap(labels: string[], colors: string[]) {
  return labels.reduce<Record<string, string>>((program, color) => {
    const colorIndex = labels.indexOf(color);
    program[color] = colors[colorIndex];
    return program;
  }, {});
}

export function capitalizeFirstLetter(string: string | undefined | null) {
  return string ? string.charAt(0).toUpperCase() + string.slice(1) : "";
} // Doing this to avoid errors when the string is undefined or null, but come back to this later
