export default function Button({ onClick, text, type }) {
  return (
    <button type={type} onClick={onClick} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-300 ease-in-out">
      {text}
    </button>
  );
}