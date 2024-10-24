import {
  Badge,
  Button,
  FormLayout,
  Layout,
  LegacyCard,
  LegacyStack,
  Page,
  TextField,
  Text,
  Icon,
  Tag,
  Checkbox,
  Select,
  Thumbnail,
  Box,
} from "@shopify/polaris";
import { SendIcon, MagicIcon } from "@shopify/polaris-icons";
import { useFormik } from "formik";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import axios from "@/Plugins/axios";
import { useNavigate } from "react-router-dom";
import { ImageIcon } from "@shopify/polaris-icons";


export function Listing() {

  const [jobLists, setJobLists] = useState([]);

  const fetchJobList = useCallback(() => {
    axios.get("/jobs").then((response) => {
      setJobLists(response.data);
    });
  }, []);



  useEffect(() => {
    fetchJobList();
  }, [fetchJobList]);

  useEffect(() => {
    console.log('TRACK JOB LIST: ');
    console.log(jobLists);
  }, [jobLists]);

  // const formik = useFormik({
  //   initialValues: {
  //       thumbnail: "",
  //       name: "",
  //       description: "",
  //       start_date: new Date().toISOString().split("T")[0],
  //       end_date: new Date(new Date().getTime() + 31 * 24 * 60 * 60 * 1000)
  //           .toISOString()
  //           .split("T")[0],
  //       company_id: "",
  //       budget: "",
  //       generate_job_listings: true,
  //       roles: "",
  //   },
  //   onSubmit: (values) => {
  //       axios
  //           .post("/projects", values)
  //           .then(() => {
  //               navigate("/projects");
  //           })
  //           .catch((error) => {
  //               formik.setErrors(error.response.data.errors);
  //           });
  //   },
  // });

  return(
    <>
      {jobLists && jobLists.map(() => (
        <LegacyCard>
          <Text as="h2" variant="bodyMd">
            TEST
          </Text>
        </LegacyCard>
      ))}
    </>
  )
}