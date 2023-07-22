export default function Chat({
  input,
  handleSubmit,
  handleInputChange,
  isLoading,
}: {
  input: string;
  handleSubmit: any;
  handleInputChange: any;
  isLoading: boolean;
}) {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSubmit(event);
    }
  };
  return (
    <div className="fixed bottom-3 w-6/12 shadow-sm shadow-base-100 join p-1 bg-base-100">
      <input
        type="text"
        value={input}
        onChange={handleInputChange}
        onKeyDown={(e) => handleKeyDown(e)}
        className=" h-14 join-item w-full shadow-accent textarea textarea-bordered textarea-md overflow-y-hidden resize-none max-h-48 bg-slate-900 text-base"
        placeholder="Type your instruction here..."
        disabled={isLoading}
      />
      <button
        className="join-item btn-square btn btn-accent text-xl h-14"
        onClick={handleSubmit}
        disabled={isLoading}
      >
        {`>`}
      </button>
    </div>
  );
}
