const server = require("./app");

const port = 5003;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
