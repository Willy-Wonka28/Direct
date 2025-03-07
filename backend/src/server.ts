import app from "./app";

const server = app.listen(app.get("port"), (error) => {
  if (error) {
    console.error("Error starting server:", error);
    return;
  }
  console.log(`Server is running on port ${app.get("port")}`);
  console.log(`Press CTRL + C to stop the server`);
  console.log(`http://localhost:${app.get("port")}`);
});

export default server;
