export default function Card({ cardHeader, cardData }: { cardHeader: string; cardData: number }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-gray-500 text-sm font-medium">{cardHeader}</h3>
      <p className="text-2xl font-bold">{cardData}</p>
    </div>
  );
}
