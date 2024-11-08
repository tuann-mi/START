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
    const colorIndex = randomIndex(colors.length);
    program[color] = colors[colorIndex];
    return program;
  }, {});
}
