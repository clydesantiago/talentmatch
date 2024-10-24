
import { MagicIcon } from "@shopify/polaris-icons";
import { useFormik } from "formik";
import React, { useCallback, useEffect, useRef, useState } from "react";
import axios from "@/Plugins/axios";
import "../../css/app.css";
import "../bootstrap";

export default function Apply() {
  const uploadInputRef = useRef(null);

  const [skills, setSkills] = useState([]);

  const formik = useFormik({
      initialValues: {
          thumbnail: "",
          name: "",
          job_title: "",
          email: "",
          phone: "",
          summary: "",
          monthly_salary: "",
          years_of_experience: "",
          resume: "",
          generate_job_listings: true,
          skills_input: "",
          skills: [],
      },
      onSubmit: (values) => {
          console.log('submeet');
      },
  });

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      console.log('trigger');
      setSkills([...skills, e.target.value]);
    }
  }, [skills, setSkills]);

  useEffect(() => {
    console.log('TRACK SKILLS');
    console.log(skills);
  }, [skills]);

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


  return (
    <>
        <NavigationMarkup/>
        <div class="flex justify-center">
            <div class="font-[sans-serif] max-w-md mt-10">
                <label class="text-base text-gray-500 font-semibold mb-2 block">Upload your CV</label>
                <input type="file"
                    class="w-full text-gray-400 font-semibold text-sm bg-white border file:cursor-pointer cursor-pointer file:border-0 file:py-2 file:px-4 file:mr-4 file:bg-gray-100 file:hover:bg-gray-200 file:text-gray-500 rounded" />
                <p class="text-xs text-gray-400 mt-2">PDF Format.</p>
            </div>
        </div>
        <div class="h-screen flex justify-center">
        <form class="w-full max-w-lg">
            <div class="flex flex-wrap -mx-3 mb-6">
                <div class="w-full md px-3 mb-6 md:mb-0">
                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                    Name
                </label>
                <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="Jane"/>
                <p class="text-red-500 text-xs italic">Please fill out this field.</p>
                </div>
            </div>
            <div class="flex flex-wrap -mx-3 mb-6">
                <div class="w-full md px-3 mb-6 md:mb-0">
                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                        Job title
                    </label>
                    <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="Jane"/>
                    <p class="text-red-500 text-xs italic">Please fill out this field.</p>
                </div>
            </div>
            <div class="flex flex-wrap -mx-3 mb-2">
                <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-city">
                    email
                </label>
                <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="sample@email.com"/>
                    <p class="text-red-500 text-xs italic">Please fill out this field.</p>
                </div>
                <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-state">
                    Phone
                </label>
                <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="+639"/>
                    <p class="text-red-500 text-xs italic">Please fill out this field.</p>
                </div>
            </div>
            <div class="flex flex-wrap -mx-3 mb-2">
                <label for="message" class="block mb-2 text-sm font-medium text-gray-700">Summary</label>
                <textarea id="message" rows="4" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Write your thoughts here..."></textarea>
            </div>
            <div class="flex flex-wrap -mx-3 mb-2">
                <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-city">
                    Monthly Salary
                </label>
                <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="PHP"/>
                    <p class="text-red-500 text-xs italic">Please fill out this field.</p>
                </div>
                <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-state">
                    Years of Experience
                </label>
                <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="eg. 25"/>
                    <p class="text-red-500 text-xs italic">Please fill out this field.</p>
                </div>
            </div>
            <div class="flex flex-wrap -mx-3 mb-6">
                <div class="w-full md px-3 mb-6 md:mb-0">
                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                    Skills
                </label>
                <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="eg. PHP, NodeJS, Laravel" onKeyDown={handleKeyDown}/>
                <p class="text-red-500 text-xs italic">Please fill out this field.</p>
                </div>
            </div>
            <div class="flex flex-wrap -mx-3 mb-6">
                <div class="w-full md px-3 mb-6 md:mb-0">
                    {skills && skills.map(skill => (
                        <span style={{
                            border: "1px solid gray",
                            borderRadius: "8px",
                            padding: "3px 15px 3px 15px",
                            marginLeft: "3px",
                            marginRight: "3px",
                        }}>{skill}</span>
                    ))}
                </div>
            </div>
            </form>
        </div>
        
    </>
  );
}
