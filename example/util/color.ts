import randomcolor from "randomcolor";

export function randomBg() {
  let color = randomcolor({ alpha: 0.3, format: "rgba" });
  console.log("color", color);
  return { backgroundColor: color };
}
