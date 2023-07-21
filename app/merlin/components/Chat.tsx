export default function Chat({
  input,
  handleSubmit,
  handleInputChange,
}: {
  input: string;
  handleSubmit: any;
  handleInputChange: any;
}) {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSubmit(event);
    }
  };
  return (
    <div className="fixed bottom-3 w-6/12 shadow-md shadow-base-200 join ">
      <input
        type="text"
        value={input}
        onChange={handleInputChange}
        onKeyDown={(e) => handleKeyDown(e)}
        className=" h-12 join-item w-full shadow-accent textarea textarea-bordered textarea-md overflow-y-hidden resize-none max-h-48 bg-slate-900 text-base"
        placeholder="Type your instruction here..."
      />
      <button
        className="join-item btn-square btn btn-accent text-xl"
        onClick={handleSubmit}
      >
        {`>`}
      </button>
    </div>
  );
}
