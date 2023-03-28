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
    text: "This is a generated text",
  };
  return (
    <div className="grid grid-cols-3 md:grid-cols-3 gap-4">
      <TopBar className="col-span-3" />
      <Sidebar className="col-span-1">
        <Chip promptData={data} />
      </Sidebar>
      <Canvas className="col-span-1">
        <CanvasBlock generatedData={generatedData} />
      </Canvas>
      <Sidebar className="col-span-1">
        <Chip promptData={data} />
      </Sidebar>
    </div>
  );
}
