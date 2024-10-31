export default function Button({ onClick, text, type }) {
  return (
    <button type={type} onClick={onClick} className="bg-som-primary hover:som-secondary dark:hover:som-secondary-dark text-white px-4 py-2 rounded-md  transition duration-300 ease-in-out">
      {text}
    </button>
  );
}