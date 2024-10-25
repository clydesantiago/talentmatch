
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
          axios.post("/talents", values);
          console.log('submitted');
      },
  });

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      setSkills([...skills, e.target.value]);
      e.target.value = '';
    }
  }, [skills, setSkills]);

  useEffect(() => {
    formik.setFieldValue("skills", [...skills]);
  }, [skills]);


//   useEffect(() => {
//     console.log('[TRACK] formik values');
//     console.log(formik.values);
//   }, [formik]);

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

        <div class="flex flex-wrap justify-center">
            <div class="py-2 m-3">
            <span class="overflow-hidden pr-7 text-3lg font-semibold sm:text-xl">Full Stack Developer</span>
                <div style={{
                    width: '500px',
                    marginTop: '30px',
                    fontSize: '14px',
                }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer rutrum non nisi in dapibus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed eget fringilla velit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Aliquam sed ligula ligula. Nulla in ex nisl. Nam sit amet dolor tincidunt, dignissim nibh vel, lobortis sem. Ut laoreet tortor leo, ac suscipit elit tincidunt dapibus. Ut ultricies felis vitae sapien molestie, vel sodales magna iaculis.

                Praesent molestie massa hendrerit tellus eleifend sollicitudin. Suspendisse potenti. Nullam vestibulum est quis egestas hendrerit. Ut posuere, nibh sit amet fringilla interdum, ligula elit cursus massa, id tempor erat ligula quis eros. Suspendisse non enim at augue venenatis malesuada. Vivamus rhoncus, dolor ut posuere vehicula, mauris sem cursus felis, eu ornare nisl nibh in felis. Donec vel ornare eros, eget posuere nibh. Curabitur convallis venenatis ligula, at consectetur lorem auctor id. Quisque vitae semper nisi.

                 - id. Quisque vitae semper nisi
                 - 
                </div>
            </div>
            <div>
            <div class="flex ">
            <div class="font-[sans-serif] max-w-md mt-10">
                <label class="text-base text-gray-500 font-semibold mb-2 block">Upload your CV</label>
                <input type="file"
                    class="w-full text-gray-400 font-semibold text-sm bg-white border file:cursor-pointer cursor-pointer file:border-0 file:py-2 file:px-4 file:mr-4 file:bg-gray-100 file:hover:bg-gray-200 file:text-gray-500 rounded" />
                <p class="text-xs text-gray-400 mt-2">PDF Format.</p>
            </div>
        </div>
        <div class="h-screen flex">
        <form class="w-full max-w-lg" style={{marginBottom: '20px'}}>
            <div class="flex flex-wrap -mx-3 mb-6">
                <div class="w-full md px-3 mb-6 md:mb-0">
                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                    Name
                </label>
                <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="Jane Doe"
                onChange={(e) => {
                    formik.setFieldValue(
                        "name",
                        e.target.value
                    );
                }}
                />
                </div>
            </div>
            <div class="flex flex-wrap -mx-3 mb-6">
                <div class="w-full md px-3 mb-6 md:mb-0">
                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                        Job title
                    </label>
                    <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="eg. Software Developer" 
                    onChange={(e) => {
                        formik.setFieldValue(
                            "job_title",
                            e.target.value
                        );
                    }}
                    />
                    
                </div>
            </div>
            <div class="flex flex-wrap -mx-3 mb-2">
                <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-city">
                    email
                </label>
                <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="sample@email.com"
                onChange={(e) => {
                    formik.setFieldValue(
                        "email",
                        e.target.value
                    );
                }}
                />
                    
                </div>
                <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-state">
                    Phone
                </label>
                <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="+639"
                onChange={(e) => {
                    formik.setFieldValue(
                        "phone",
                        e.target.value
                    );
                }}
                />
                    
                </div>
            </div>
            <div class="flex flex-wrap -mx-3 mb-2">
                <label for="message" class="block mb-2 text-sm font-medium text-gray-700">Summary</label>
                <textarea id="message" rows="4" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Give your best pitch..."
                onChange={(e) => {
                    formik.setFieldValue(
                        "summary",
                        e.target.value
                    );
                }}
                ></textarea>
            </div>
            <div class="flex flex-wrap -mx-3 mb-2">
                <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-city">
                    Monthly Salary
                </label>
                <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="PHP"
                onChange={(e) => {
                    formik.setFieldValue(
                        "monthly_salary",
                        e.target.value
                    );
                }}
                />
                    
                </div>
                <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-state">
                    Years of Experience
                </label>
                <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="eg. 25"
                onChange={(e) => {
                    formik.setFieldValue(
                        "years_of_experience",
                        e.target.value
                    );
                }}
                />
                    
                </div>
            </div>
            <div class="flex flex-wrap -mx-3 mb-6">
                <div class="w-full md px-3 mb-6 md:mb-0">
                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                    Skills
                </label>
                <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="eg. PHP, NodeJS, Laravel" onKeyDown={handleKeyDown}/>
                </div>
            </div>
            <div class="flex flex-wrap -mx-3 mb-6">
                <div class="w-full md px-3 mb-6 md:mb-0" style={{width: '410px'}}>
                    {skills && skills.map(skill => (
                        <span style={{
                            border: "1px solid gray",
                            borderRadius: "8px",
                            padding: "3px 15px 3px 15px",
                            marginLeft: "3px",
                            marginRight: "3px",
                            marginTop: "3px",
                            marginBottom: "3px",
                        }}>{skill}</span>
                    ))}
                </div>
            </div>
            <button class="border border-gray-700 p-2 rounded" style={{marginBottom: "40px"}} onClick={(e) => {
                e.preventDefault();
                formik.handleSubmit()
            }}>
            <svg style={{display: "inline"}} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-send" viewBox="0 0 16 16">
  <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z"/>
</svg> Submit Application
            </button>
            </form>
        </div>

            </div>
        </div>        
    </>
  );
}
