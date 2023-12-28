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
    <div className="join fixed bottom-3 w-6/12 bg-base-100 p-1 shadow-sm shadow-base-100">
      <input
        type="text"
        value={input}
        onChange={handleInputChange}
        onKeyDown={(e) => handleKeyDown(e)}
        className="textarea join-item textarea-bordered textarea-md h-10 max-h-48 w-full resize-none overflow-y-hidden bg-slate-900 text-base text-text-400 shadow-accent placeholder:text-sm placeholder:text-text-500"
        placeholder={
          !!selectedBlock
            ? `Make it shorter, longer, more specific, or more creative...`
            : "Select a block to chat with..."
        }
        disabled={isLoading || !!!selectedBlock}
      />
      <button
        className="btn btn-square btn-accent join-item h-10 text-xl"
        onClick={handleSubmit}
        disabled={isLoading || !!!selectedBlock}
      >
        {`>`}
      </button>
    </div>
  );
}
