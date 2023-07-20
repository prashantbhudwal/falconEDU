import React, { useState } from "react";

export default function Chat() {
  const [message, setMessage] = useState("");

  const handleChange = (event: any) => {
    setMessage(event.target.value);
  };

  return (
    <div className="fixed bottom-2 w-7/12 shadow-lg join">
      <textarea
        value={message}
        onChange={handleChange}
        className=" h-12 join-item w-full textarea textarea-bordered textarea-sm overflow-y-hidden resize-none max-h-48"
        placeholder="Type your message here..."
      />
      <button className="join-item btn-square btn btn-accent text-xl">{`>`}</button>
    </div>
  );
}
