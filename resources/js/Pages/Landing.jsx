import { useEffect } from "react";
import "../../css/app.css";
import "../bootstrap";

export default function Landing() {

  const mockJobList = [
    {job_id: 1, job_title: '', job_description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna .'},
    {job_id: 2, job_title: '', job_description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna .'},
    {job_id: 3, job_title: '', job_description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna .'},
    {job_id: 4, job_title: '', job_description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna .'},
    {job_id: 5, job_title: '', job_description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna .'},
  ];


  const CardMarkUp = (data) => {
    console.log('cardmarkup data');
    console.log(data);
    return (
      <div class="m-5">
        <div class="group mx-2 mt-10 grid max-w-screen-md grid-cols-12 space-x-8 overflow-hidden rounded-lg border py-8 text-gray-700 shadow transition hover:shadow-lg sm:mx-auto">
          <a href="#" class="order-2 col-span-1 mt-4 -ml-14 text-left text-gray-600 hover:text-gray-700 sm:-order-1 sm:ml-4">
            <div class="group relative h-16 w-16 overflow-hidden rounded-lg">
              {/* <img src="/images/EC25KRDBo-K3w8GexNHSE.png" alt="" class="h-full w-full object-cover text-gray-700" /> */}
            </div>
          </a>
          <div class="col-span-11 flex flex-col pr-8 text-left sm:pl-4">
            <h3 class="text-sm text-gray-600">Invision</h3>
            <a href="#" class="mb-3 overflow-hidden pr-7 text-lg font-semibold sm:text-xl"> Sr. Frontend Engineer </a>
            <p class="overflow-hidden pr-7 text-sm">Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna .</p>

            <div class="mt-5 flex flex-col space-y-3 text-sm font-medium text-gray-500 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2">
              <div class="">Experience:<span class="ml-2 mr-3 rounded-full bg-green-100 px-2 py-0.5 text-green-900"> 2 Years </span></div>
              <div class="">Salary:<span class="ml-2 mr-3 rounded-full bg-blue-100 px-2 py-0.5 text-blue-900">180-250k</span></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const NavigationMarkup = () => {
    return (
      <nav class="block w-full max-w-screen-lg px-4 py-2 mx-auto text-white bg-slate-900 shadow-md rounded-md lg:px-8 lg:py-3 mt-10">
        <div class="container flex flex-wrap items-center justify-between mx-auto text-gray-100">
          <a href="#"
            class="mr-4 block cursor-pointer py-1.5 text-base text-gray-200 font-semibold">
            TalentMatch
          </a>
          <div class="hidden lg:block">
            <ul class="flex flex-col gap-2 mt-2 mb-4 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
              <li class="flex items-center p-1 text-sm gap-x-2 text-gray-200">
                <a href="#" class="flex items-center">
                  Login
                </a>
              </li>
              <li class="flex items-center p-1 text-sm gap-x-2 text-gray-200">
                <a href="#" class="flex items-center">
                  Jobs
                </a>
              </li>
              <li class="flex items-center p-1 text-sm gap-x-2 text-gray-200">
                <a href="#" class="flex items-center">
                  About
                </a>
              </li>
              <li class="flex items-center p-1 text-sm gap-x-2 text-gray-200">
                <a href="#" class="flex items-center">
                  Support
                </a>
              </li>
            </ul>
          </div>
          <button
            class="relative ml-auto h-6 max-h-[40px] w-6 max-w-[40px] select-none rounded-lg text-center align-middle text-xs font-medium uppercase text-inherit transition-all hover:bg-transparent focus:bg-transparent active:bg-transparent disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none lg:hidden"
            type="button">
            <span class="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </span>
          </button>
        </div>
      </nav>
    );
  }

  const LandingSearch = () => {
    return(
      <main class="mt-16 mx-auto max-w-7xl px-4">
            <div class="text-center">
                <h1 class="text-4xl tracking-tight font-extrabold  text-black sm:text-5xl md:text-6xl">
                    <span class="block xl:inline">Find jobs with ease.</span>
                </h1>
                <p class="mt-3 max-w-md mx-auto text-base  text-black sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                    </p><div class="max-w-2xl mx-auto font-medium">
                    “TalentMatch is our first stop whenever we're hiring. We've hired mostly of our employees in the last few years, all thanks to TalentMatch.”
                    — <span class="text-base">Matthew Hall, ArborXR</span>
                </div>
                <p></p>
                            </div>
        </main>
    );
  }

  return(
    <>
      <NavigationMarkup/>
      <LandingSearch/>
      {mockJobList.map((data) => (
        <CardMarkUp data={data}/>
      ))}
    </>
  );
}