

export default function Chat({
  input,
  handleSubmit,
  handleInputChange,
  isLoading,
  selectedBlock,
}: {
  input: string;
  handleSubmit: any;
  handleInputChange: any;
  isLoading: boolean;
  selectedBlock: any;
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
        className="placeholder:text-sm placeholder:text-slate-500 h-10 join-item w-full shadow-accent textarea textarea-bordered textarea-md overflow-y-hidden resize-none max-h-48 bg-slate-900 text-base"
        placeholder={
          !!selectedBlock
            ? `Make it shorter, longer, more specific, or more creative...`
            : "Select a block to chat with..."
        }
        disabled={isLoading || !!!selectedBlock}
      />
      <button
        className="join-item btn-square btn btn-accent text-xl h-10"
        onClick={handleSubmit}
        disabled={isLoading || !!!selectedBlock}
      >
        {`>`}
      </button>
    </div>
  );
}
