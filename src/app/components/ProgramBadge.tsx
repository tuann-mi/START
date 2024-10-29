const COLORS = [
  "bg-blue-100 text-blue-800",
  "bg-green-100 text-green-800",
  "bg-purple-100 text-purple-800",
  "bg-orange-100 text-orange-800",
  "bg-red-100 text-red-800",
  "bg-yellow-100 text-yellow-800",
  "bg-indigo-100 text-indigo-800",
  "bg-pink-100 text-pink-800",
  "bg-teal-100 text-teal-800",
];

function getColorForProgram(programName) {
  const hash = programName
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);

  return COLORS[hash % COLORS.length];
}

export function ProgramsList({ programs }) {
  if (!programs?.length)
    return <span className="text-gray-400">No programs</span>;

  return (
    <div className="flex flex-wrap gap-1">
      {programs.map((program, index) => (
        <ProgramBadge key={index} program={program} />
      ))}
    </div>
  );
}

export function ProgramBadge({ program }) {
  const colorClass = getColorForProgram(program);

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass} mr-1 mb-1`}
    >
      {program}
    </span>
  );
}
