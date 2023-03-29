import Canvas from "./Canvas";
import Chip from "./Chip";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import CanvasBlock from "./CanvasBlock";

export default function Merlin() {
  const data = {
    name: "Merlin",
    type: "wizard",
    age: 1000,
    location: "Camelot",
    friends: ["Arthur", "Gwen", "Lancelot"],
  };

  const generatedData = {
    text: "This is a generated text. This is a generated text. This is a generated text. This is a generated text. This is a generated text. This is a generated text. This is a generated text. This is a generated text. This is a generated text. This is a generated text. This is a generated text. This is a generated text.",
  };
  return (
    <div className="grid grid-cols-12 gap-4 w-full">
      <TopBar className="col-start-1 col-span-full h-16 max-h-16" />
      <Sidebar
        className="col-start-1 col-span-2 row-start-2"
        heading={"Blocks"}
      >
        <Chip promptData={data} />
        <Chip promptData={data} />
        <Chip promptData={data} />
      </Sidebar>
      <Canvas className="col-start-3 col-span-8 h-screen">
        <CanvasBlock generatedData={generatedData} />
        <CanvasBlock generatedData={generatedData} />
        <CanvasBlock generatedData={generatedData} />
      </Canvas>
      <Sidebar className="col-start-11 col-span-2" heading={"Outline"}>
        1. This is the text <br /> 2. More text <br />
        1. This is the text <br /> 2. More text <br />
      </Sidebar>
    </div>
  );
}
