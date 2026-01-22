// /** @type {import('tailwindcss').Config} */
// export default {
//   content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
//   theme: {
//     extend: {
//       screens: {
//         xs: "320px",
//         sm: "640px",
//         md: "768px",
//         lg: "1024px",
//         xl: "1280px",
//         "2xl": "1536px",
//       },
//     },
//   },
//   plugins: [],
// };

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/app/folder/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gray1: "#222222",
        gray2: "#696969",
        gray3: "#F6F6F6",
        gray4: "#B8B8B8",
        gray5: "#F8F9FA",
        gray6: "#DEE2E6",
        gray7: "#F0F2F4",
        lightblue: "#C2E7F8",
        blue: "#016992",
        blue2: "#ECF3F6",
        blue3: "#DEE7EB",
        blue4: "#01699224",
        blue5: "#0070BA",
        red: "#BF3127",
        black1: "#333333",
        black2: "#03030FB3",
        black3: "#03030F",
        white1: "#F7F7F4",
        skyblue2: "#F9FAFB",
      },
    },
  },
  plugins: [],
};
