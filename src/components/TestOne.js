import React from 'react'

function TestOne() {
  return (
    <div flex gap-5 p-2>
      <header className="items-top flex h-1/3 max-h-96 flex-col justify-center gap-5 bg-gray-800 px-32 py-12 pt-3 text-center text-white">
        <nav className="mt-1 flex justify-between bg-gray-800 text-white">
          <h5 className="m-0 p-0 font-bold">Header Logo</h5>
          <div className="m-0 flex items-center gap-5 p-0 text-xs font-medium text-gray-400">
            <p>header link one</p>
            <p>header link two</p>
            <p>header link three</p>
          </div>
        </nav>
        <div className="h-30 relative flex w-full items-center justify-between py-5">
          <div className="mr-3 w-1/2 text-wrap text-left">
            <h1 className="line-clamp-2 text-xl font-bold leading-none">
              This website is awesome
            </h1>
            <p className="text-grey-800 my-2 line-clamp-3 text-wrap text-xs leading-tight">
              This website has some subtext that goes here under the main title.
              It's a smaller font and the color is lower contrast.
            </p>
            <button className="w-28 rounded-md bg-blue-500 p-4 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700">
              Sign up
            </button>
          </div>
          <div className="max-h-42 container ml-3 h-full w-auto">
            <img
              src="https://images.pexels.com/photos/165971/pexels-photo-165971.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              className="h-38 w-96 rounded object-cover"
              alt="Image description"
            />
          </div>
        </div>
      </header>

      <main className="bg-grey_awesome h-auto border-b border-t border-gray-200 px-0 pb-16 pt-0">
        <section className="flex h-auto w-auto flex-col items-center justify-center px-32 py-6">
          <h4 className="mb-7 text-xl font-bold">Some random information.</h4>
          <div className="container mx-auto grid grid-cols-4 gap-5 text-center text-xs">
            <div className="container flex flex-col items-center">
              <img
                className="h-28 w-28 rounded-md object-cover"
                src="https://images.stockcake.com/public/0/4/e/04e60aaa-1f89-4d0e-bffd-c8439fd30118_large/vintage-guitar-solo-stockcake.jpg"
                alt="Image 1"
              />
              <p className="w-28 text-center text-xs">
                This is some subtext under an illustration or image
              </p>
            </div>
            <div className="container flex flex-col items-center">
              <img
                className="h-28 w-28 rounded-md object-cover"
                src="https://images.stockcake.com/public/d/3/3/d3322735-dd75-4265-bec9-5b4e2b2dc86f_large/guitar-against-bricks-stockcake.jpg"
                alt="Image 2"
              />
              <p className="w-28 text-center text-xs">
                This is some subtext under an illustration or image
              </p>
            </div>
            <div className="container flex flex-col items-center">
              <img
                className="h-28 w-28 rounded-md object-cover"
                src="https://images.stockcake.com/public/8/3/5/83528acf-ed16-447b-8136-4ac445e52a63_large/vintage-guitar-corner-stockcake.jpg"
                alt="Image 3"
              />
              <p className="w-28 text-center text-xs">
                This is some subtext under an illustration or image
              </p>
            </div>
            <div className="container flex flex-col items-center">
              <img
                className="h-28 w-28 rounded-md object-cover"
                src="https://images.stockcake.com/public/6/5/e/65e34a8f-254a-4647-89eb-eec3af87c03f_large/vintage-guitar-display-stockcake.jpg"
                alt="Image 4"
              />
              <p className="h-28 w-28 text-center text-xs">
                This is some subtext under an illustration or image
              </p>
            </div>
          </div>
        </section>
        <section className="bg-gray-200 px-40 py-16">
          <h4 className="text-medium text-wrap font-thin italic">
            This is an inspiring quote, or a testimonial from a customer. Maybe
            it's just filling up space, or maybe people will actually read it.
            Who knows? All I know is that it looks nice.
          </h4>
          <p className="text-right text-xs font-semibold">
            -Thor, God of Thunder
          </p>
        </section>
        <section className="border-gray-200 bg-white px-32 py-12">
          <div className="flex items-center justify-between rounded bg-blue-500 px-20 py-8">
            <div>
              <h4 className="text-sm font-semibold text-white">
                Call to action! It's time!
              </h4>
              <p className="text-xs font-thin text-white">
                Sign up for our product by clicking that button right over
                there!
              </p>
            </div>
            <button className="w-28 rounded-md border-2 border-white bg-blue-500 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700">
              Sign up
            </button>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 py-8 text-center text-xs font-thin text-gray-200">
        <p>Copyright &copy; The Odin Project 2021</p>
      </footer>
    </div>
  )
}

export default TestOne

// // import React from "react";
// // import { Helmet } from "react-helmet";
// // import './TestOne.css'; // Import your CSS module

// // function TestOne() {
// //     return (
// //         <>
// //             <Helmet>
// //                 <link
// //                     rel="stylesheet"
// //                     href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
// //                 />

// //             </Helmet>
// //             <div className="flex justify-center items-center h-screen m-0 bg-gray-100">
// //                 <div className="grid gap-5 grid-cols-3 grid-rows-3">
// //                     {[...Array(9).keys()].map((i) => (
// //                         <div
// //                             key={i}
// //                             className="pattern-node w-24 h-24 bg-transparent flex justify-center items-center cursor-pointer"
// //                             data-node={i + 1}
// //                         >
// //                             <span className="material-symbols-outlined">
// //                                 fiber_manual_record
// //                             </span>
// //                         </div>
// //                     ))}
// //                 </div>
// //             </div>
// //         </>
// //     );
// // }

// // export default TestOne;

// import React, { useEffect } from "react";
// import { Helmet } from "react-helmet";
// import './TestOne.css'; // Import your CSS module

// function TestOne() {
//     useEffect(() => {
//         // Create script element
//         const script = document.createElement('script');
//         script.src = '/patternLockScript.js'; // Path to your script in the public folder
//         script.async = true;
//         script.onload = () => {
//             console.log('Script loaded successfully');
//         };
//         script.onerror = () => {
//             console.error('Error loading script');
//         };

//         // Append script to the body
//         document.body.appendChild(script);

//         // Cleanup function to remove the script when component unmounts
//         return () => {
//             document.body.removeChild(script);
//         };
//     }, []); // Empty dependency array means this runs once when the component mounts

//     return (
//         <>
//             <Helmet>
//                 <link
//                     rel="stylesheet"
//                     href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
//                 />
//             </Helmet>
//             <div className="flex justify-center items-center h-screen m-0 bg-gray-500">
//                 <div className="grid gap-5 grid-cols-3 grid-rows-3">
//                     {[...Array(9).keys()].map((i) => (
//                         <div
//                             key={i}
//                             className="pattern-node w-24 h-24 bg-transparent flex justify-center items-center cursor-pointer"
//                             data-node={i + 1}
//                         >
//                             <span className="material-symbols-outlined">
//                                 fiber_manual_record
//                             </span>
//                         </div>
//                     ))}

//                 </div>
//                 <div className="keyPattern w-24 h-24 bg-transparent font-bold text-white">

//                 </div>
//             </div>
//         </>
//     );
// }

// export default TestOne;
