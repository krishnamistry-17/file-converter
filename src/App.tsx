import { RouterProvider } from "react-router-dom";
import routes from "./routes/route.config";

function App() {
  return <RouterProvider router={routes} />;
}
export default App;
