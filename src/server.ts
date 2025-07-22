import { IncomingMessage, Server, ServerResponse } from "http";
import mongoose from "mongoose";
import { app } from "./app";
import { envVars } from "./app/config/env";
import { seedSuperAdmin } from "./app/utils/seed.super.admin";

let server: Server<typeof IncomingMessage, typeof ServerResponse>;

async function serverStart() {
  try {
    await mongoose.connect(
      "mongodb+srv://Rakib:Rakib@cluster0.cfb3mbc.mongodb.net/Tour-management-collections?retryWrites=true&w=majority&appName=Cluster0"
    );
    server = app.listen(envVars.PORT, () => {
      console.log(`server is running on port: ${envVars.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

(async() => {
  await serverStart();
  await seedSuperAdmin();
})()


// unHandled Rejection error
// process.on('unhandledRejection', (err) => {
//     console.log('unhandled rejection error', err);

//     if(server){
//         server.close(() =>{
//             process.exit(1)
//         })
//     }
//     process.exit(1);
// })

// Promise.reject(new Error('I forgot to catch this promise error'))

//
// process.on('uncaughtException', (err) => {
//     console.log('unhandled rejection error', err);

//     if(server){
//         server.close(() =>{
//             process.exit(1)
//         })
//     }
//     process.exit(1);
// })

// throw new Error('i forgot handle to local error')

process.on("SIGINT", () => {
  console.log("server shut down");

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
