// import { JSX } from "solid-js/jsx-runtime";

// export function parseStringToHTML(input: string): JSX.Element {
//   // Split the input into lines by detecting patterns for paragraphs and lists
//   const lines = input.split("\n").filter((line) => line.trim() !== "");

//   // Extract and structure the content
//   const firstLine = lines.shift(); // First line as the paragraph
//   const listItems = lines.map((line) => line.trim().replace(/^\d+\.\s*/, "")); // Remove numbering

//   return (
//     <div>
//       {/* Render the first paragraph */}
//       <p>{firstLine}</p>

//       {/* Render the list */}
//       <ul>
//         {listItems.map((item) => (
//           <li>{item}</li>
//         ))}
//       </ul>
//     </div>
//   );
// }
