// initialize server
import "dotenv/config";
import "./db";
import "./models/Video";
import "./models/User";
//서버에 db를 연결시키고, db에서는 mongoose를 연결시켜서 model을 인식하게 한다.
import app from "./server";

const PORT = 4000;

const handleListening = () => {
  console.log(`✅ Server listenting on http://localhost:${PORT} 🚀 `);
};

app.listen(PORT, handleListening); // server is listening to request by using express server
