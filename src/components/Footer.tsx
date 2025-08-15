import React from "react";

export const Footer = () => {
  return (
    <section>
      <div
        className="mt-2 
         relative "
      >
        <div className="  w-full" style={{ borderRadius: "0.5rem" }}>
          <div
            className="preview flex min-h-[350px] w-full 
          justify-center p-2 sm:p-10 items-center"
          >
            <div
              className=" border-white/[0.1] px-8 py-20
              bg-muted/30 w-full relative
                overflow-hidden"
            >
              <div
                className="max-w-7xl mx-auto text-sm
                 justify-between items-start
              "
              >
                <div
                  className="flex flex-col items-center 
                justify-center w-full relative"
                >
                  <div className="mr-0 md:mr-4  md:flex mb-4">
                    <a
                      className="font-normal 
                            flex space-x-2 items-center
                             text-sm mr-1  text-black px-2 py-1 
                             relative z-20"
                      href="/"
                    >
                   
                      <span
                        className="font-medium text-black
                     "
                      >
                         <span className="text-white">Cine</span>
            <span className="text-red-600">phile</span>
                      </span>
                    </a>
                  </div>
                  <ul
                    className="transition-colors flex sm:flex-row flex-col hover:text-text-neutral-800
 text-black list-none gap-4"
                  >
                    <li className="list-none">
                      <a className=" cursor-pointer transition-colors hover:text-text-neutral-800 ">
                        Contact
                      </a>
                    </li>
                    <li className="list-none">
                      <a className=" cursor-pointer transition-colors hover:text-text-neutral-800 ">
                        About
                      </a>
                    </li>
                    <li className="list-none">
                      <a
                        className="transition-colors hover:text-text-neutral-800
                    cursor-pointer     "
                      >
                        Services
                      </a>
                    </li>

                    <li className="list-none">
                      <a className=" cursor-pointer transition-colors hover:text-text-neutral-800 ">
                        Privacy
                      </a>
                    </li>
                    <li className="list-none">
                      <a className=" cursor-pointer transition-colors hover:text-text-neutral-800 ">
                        Terms
                      </a>
                    </li>
                  </ul>
                  <div
                    className="w-[calc(100%+var(--offset))]  h-[var(--height)] bg-[linear-gradient(to_right,var(--color),var(--color)_50%,transparent_0,transparent)] [background-size:var(--width)_var(--height)] [mask:linear-gradient(to_left,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_right,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)] [mask-composite:exclude] z-30 dark:bg-[linear-gradient(to_right,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)] max-w-7xl mx-auto mt-8"
                    style={
                      {
                        "--background": "#ffffff",
                        "--color": "rgba(0, 0, 0, 0.2)",
                        "--height": "1px",
                        "--width": "5px",
                        "--fade-stop": "90%",
                        "--offset": "200px",
                        "--color-dark": "rgba(255, 255, 255, 0.2)",
                        maskComposite: "exclude",
                      } as React.CSSProperties
                    }
                  ></div>
                </div>
                <div className="flex sm:flex-row flex-col justify-between mt-8 items-center w-full">
                  <p className=" dark:text-neutral-400 mb-8 sm:mb-0">
                    © Cinephile
                  </p>
                  <div className="flex gap-4">
                    <a href="#">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-6 w-6  text-black"
                      >
                        <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path>
                        <path d="M8 11l0 5"></path>
                        <path d="M8 8l0 .01"></path>
                        <path d="M12 16l0 -5"></path>
                        <path d="M16 16v-3a2 2 0 0 0 -4 0"></path>
                      </svg>
                    </a>
                    <a href="#">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-6 w-6  text-black"
                      >
                        <path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5"></path>
                      </svg>
                    </a>

                    <a href="#">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-6 w-6  text-black"
                      >
                        <path d="M4 4m0 4a4 4 0 0 1 4 -4h8a4 4 0 0 1 4 4v8a4 4 0 0 1 -4 4h-8a4 4 0 0 1 -4 -4z"></path>
                        <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"></path>
                        <path d="M16.5 7.5l0 .01"></path>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
