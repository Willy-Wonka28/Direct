import app from "./app";

const server = app.listen(app.get("port"), (error) => {
  console.log(`Server is running on port ${app.get("port")}`);
  console.log(`http://localhost:${app.get("port")}`);
  console.log(`Press CTRL + C to stop the server`);
});

export default server;
