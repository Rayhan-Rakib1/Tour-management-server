/* eslint-disable no-console */
import { IncomingMessage, Server, ServerResponse } from "http";
import mongoose from "mongoose";
import { app } from "./app";
import envVars from "./app/confiq/env";

let server: Server<typeof IncomingMessage, typeof ServerResponse>;

async function serverStart() {
  console.log(envVars.NODE_ENV);
  try {
    await mongoose.connect(
      "mongodb+srv://rayhan:rayhan@cluster0.cfb3mbc.mongodb.net/BooksCollection?retryWrites=true&w=majority&appName=Cluster0"
    );
    server = app.listen(envVars.PORT, () => {
      console.log(`server is running on port: ${envVars.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

serverStart();

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
