// // 1st case
// const sum = (a, b) => {
//     return a + b;
// };

// console.log(sum(10,10));


// // 2nd case
// const sum = (a, b) => {
//   return a + b ;
// }

// console.log(sum(10));
// thus we got "NaN" but still we didnt we get any error


// // 3rd case
// const sum = (a, b) => {
//   if(a && b) {
//     // thus both a and b are true
//     return a + b;
//   } 
//   // "throw" its keyword
//   // "Error" its a build in object 
//   throw new Error('Invalid number of arguments passed');
// }

// console.log(sum(10));
// // thus now our code is braeking as error is thrown but we are not handling it


// // 4th case
// const sum = (a, b) => {
//   if(a && b) {
//     return a + b;
//   } 
//   throw new Error('Invalid number of arguments passed');
// }

// // for sync code ie not dealing with files 
// try {
//   console.log(sum(10));
// } catch(error) {
//   console.log("Error Occured");
//   // console.log(error);
// }

// console.log('All done!!');
// //  thus, now our code is not breaking



const sum = (a, b) => {
  if(a && b) {
    return a + b;
  } 
  throw new Error('Invalid number of arguments passed');
}

try {
  console.log(sum(10));
} catch(error) {
  console.log("Error Occured");
}

console.log('All done!!');


