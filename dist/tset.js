"use strict";
// import { Prisma, PrismaClient } from "@prisma/client";
// const prisma = new PrismaClient();
// const userdata = {};
// async function insertData() {
//   const res = await prisma.user.create({
//     data: {
//       username: "rana",
//       firstname: "zain",
//       lastname: "rana",
//       email: "ranazain@gmal.com",
//       password: "12",
//     },
//   });
//   console.log(res);
// }
// // insertData()
// async function updatedata() {
//     await prisma.todo.create({
//         data:{
//             title:"dasd",
//             discription:"dasdsadasfasf awfnfqwnf onwa",
//             complete: false,
//             userId:10
//         }
//     })
// //   const res = await prisma.user.update({
// //     where: {
// //       email: "rana@gmal.com",
// //     },
// //     data: {
// //       username: "Viola the Magnificent",
// //     },
// //   });
// //   console.log(res);
// }
// // updatedata();
// async function getTodos() {
//     const res = await prisma.todo.findMany({
//       where: {
//         userId: 1,
//       },
//     });
//     console.log(res);
//   }
// //   getTodos()
