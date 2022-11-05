import { useState } from "react";
import { SketchPicker, ColorChangeHandler } from "react-color";
import { invoke } from "@tauri-apps/api/tauri";
import Color from "color";

function App() {
  const [color, setColor] = useState("#00FF00");
  const [colors, setColors] = useState<
    { r: number; g: number; b: number }[] | undefined
  >();

  const colorChangeHandler: ColorChangeHandler = (color) => {
    console.log("Change handler FE", color);
    setColor(color.hex);
    invoke<string>("generate_gradient", { ...color.rgb }).then((response) => {
      const result = (response as unknown as [number, number, number][]).map(
        (e) => ({ r: e[0], g: e[1], b: e[2] })
      );
      setColors(result);
    });
  };

  return (
    <>
      <SketchPicker onChange={colorChangeHandler} color={color} />
      <div className="flex flex-col">
        {colors &&
          colors.map((c) => (
            <div
              className="grow h-4"
              key={`${c.r}${c.g}${c.b}${Math.random()}`}
              style={{ backgroundColor: Color(c).hex() }}
            ></div>
          ))}
      </div>
    </>
  );
}

export default App;
