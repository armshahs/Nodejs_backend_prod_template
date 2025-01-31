import app from "./app";
import { config } from "./config";

app.listen(config.server.port, () => {
  console.log(`Server running on port ${config.server.port}`);
  // Add logging
  //   logger.info(`Server running on port ${config.server.port}`);
});
