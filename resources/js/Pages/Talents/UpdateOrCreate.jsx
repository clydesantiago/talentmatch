import {
    Button,
    FormLayout,
    Layout,
    LegacyCard,
    LegacyStack,
    Page,
    TextField,
    Tag,
    Thumbnail,
    Box,
} from "@shopify/polaris";
import { useFormik } from "formik";
import React, { useCallback, useEffect, useRef, useState } from "react";
import axios from "@/Plugins/axios";
import { useNavigate, useParams } from "react-router-dom";
import { ImageIcon } from "@shopify/polaris-icons";

export default function Create() {
    const { id } = useParams();
    const uploadThumbnailRef = useRef(null);
    const uploadResumeRef = useRef(null);
    const navigate = useNavigate();

    const [uploading, setUploading] = useState(false);
    const [extracting, setExtracting] = useState(false);

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
            const request = id
                ? axios.put(`/talents/${id}`, values)
                : axios.post("/talents", values);

            request
                .then(() => {
                    navigate("/talents");
                })
                .catch((error) => {
                    formik.setErrors(error.response.data.errors);
                });
        },
    });

    const handleThumbnailUpload = useCallback(
        (event) => {
            if (!event.target.files.length) {
                return;
            }

            const file = event.target.files[0];

            const formData = new FormData();

            formData.append("file", file);

            axios
                .post("/upload", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
                .then((response) => {
                    formik.setFieldValue("thumbnail", response.data.url);
                });
        },
        [formik]
    );

    const fetchSingleTalent = useCallback(() => {
        axios.get(`/talents/${id}`).then((response) => {
            const project = response.data;

            formik.setValues({ ...project });
        });
    }, [id]);

    const extractFromResume = useCallback(() => {
        setExtracting(true);

        axios
            .post("/talents/extract-from-resume", {
                resume: formik.values.resume,
            })
            .then((response) => {
                formik.setValues({
                    ...formik.values,
                    ...response.data,
                });
            })
            .finally(() => {
                setExtracting(false);
            });
    }, [formik.values.resume]);

    // Monitor resume changes
    useEffect(() => {
        if (formik.values.resume) {
            extractFromResume();
        }
    }, [formik.values.resume]);

    useEffect(() => {
        if (id) {
            fetchSingleTalent();
        }
    }, []);

    const additionalSettingsMarkup = (
        <Layout.Section variant="oneThird">
            <LegacyCard title="Resume" sectioned>
                <input
                    accept=".pdf"
                    type="file"
                    ref={uploadResumeRef}
                    style={{ display: "none" }}
                    onChange={(event) => {
                        if (!event.target.files.length) {
                            return;
                        }

                        setUploading(true);
                        const file = event.target.files[0];

                        const formData = new FormData();

                        formData.append("file", file);

                        axios
                            .post("/upload", formData, {
                                headers: {
                                    "Content-Type": "multipart/form-data",
                                },
                            })
                            .then((response) => {
                                formik.setFieldValue(
                                    "resume",
                                    response.data.url
                                );
                            })
                            .finally(() => {
                                setUploading(false);
                            });
                    }}
                />
                <LegacyStack alignment="center">
                    <Thumbnail
                        size="small"
                        source="https://static-00.iconduck.com/assets.00/pdf-icon-224x256-zvvxtuvv.png"
                    />

                    {formik.values.resume ? (
                        <Button
                            variant="plain"
                            onClick={() => formik.setFieldValue("resume", "")}
                        >
                            Remove resume
                        </Button>
                    ) : (
                        <Button
                            loading={uploading || extracting}
                            variant="plain"
                            onClick={() => {
                                uploadResumeRef.current.click();
                            }}
                        >
                            Upload resume
                        </Button>
                    )}
                </LegacyStack>
            </LegacyCard>
        </Layout.Section>
    );

    return (
        <Page
            backAction={{
                content: "Back",
                onAction: () => navigate("/talents"),
            }}
            title={id ? "Talent details" : "Create talent"}
            primaryAction={{
                content: "Save",
                onAction: () => formik.handleSubmit(),
            }}
        >
            <Layout>
                <Layout.Section>
                    <LegacyCard sectioned>
                        <FormLayout>
                            <LegacyStack alignment="center">
                                <LegacyStack.Item fill>
                                    <TextField
                                        label="Name"
                                        placeholder="John Doe"
                                        value={formik.values.name}
                                        error={formik.errors.name}
                                        onChange={(value) =>
                                            formik.setFieldValue("name", value)
                                        }
                                    />
                                </LegacyStack.Item>
                                <Box paddingBlockStart={100}>
                                    <input
                                        accept="image/*"
                                        type="file"
                                        ref={uploadThumbnailRef}
                                        style={{ display: "none" }}
                                        onChange={handleThumbnailUpload}
                                    />
                                    <Button
                                        variant="plain"
                                        onClick={() => {
                                            uploadThumbnailRef.current.click();
                                        }}
                                    >
                                        <Thumbnail
                                            source={
                                                formik.values.thumbnail ||
                                                ImageIcon
                                            }
                                            alt="Thumbnail"
                                        />
                                    </Button>
                                </Box>
                            </LegacyStack>
                            <TextField
                                label="Job title"
                                placeholder="Laravel Developer"
                                value={formik.values.job_title}
                                error={formik.errors.job_title}
                                onChange={(value) =>
                                    formik.setFieldValue("job_title", value)
                                }
                            />
                            <FormLayout.Group>
                                <TextField
                                    label="Email"
                                    placeholder="hello@example.com"
                                    type="email"
                                    value={formik.values.email}
                                    error={formik.errors.email}
                                    onChange={(value) =>
                                        formik.setFieldValue("email", value)
                                    }
                                />
                                <TextField
                                    label="Phone"
                                    placeholder="+1234567890"
                                    type="tel"
                                    value={formik.values.phone}
                                    error={formik.errors.phone}
                                    onChange={(value) =>
                                        formik.setFieldValue("phone", value)
                                    }
                                />
                            </FormLayout.Group>
                            <TextField
                                label="Summary"
                                placeholder="A brief summary about the talent"
                                multiline={4}
                                value={formik.values.summary}
                                error={formik.errors.summary}
                                onChange={(value) =>
                                    formik.setFieldValue("summary", value)
                                }
                            />

                            <FormLayout.Group>
                                <TextField
                                    label="Monthly salary"
                                    placeholder="1000"
                                    prefix="$"
                                    value={formik.values.monthly_salary}
                                    error={formik.errors.monthly_salary}
                                    onChange={(value) =>
                                        formik.setFieldValue(
                                            "monthly_salary",
                                            value
                                        )
                                    }
                                />
                                <TextField
                                    label="Years of experience"
                                    placeholder="2"
                                    type="number"
                                    suffix="years"
                                    value={formik.values.years_of_experience}
                                    error={formik.errors.years_of_experience}
                                    onChange={(value) =>
                                        formik.setFieldValue(
                                            "years_of_experience",
                                            value
                                        )
                                    }
                                />
                            </FormLayout.Group>
                            <LegacyStack vertical spacing="tight">
                                <div
                                    onKeyPress={(event) => {
                                        if (event.key === "Enter") {
                                            const skills = [
                                                ...formik.values.skills,
                                            ];

                                            const newskills =
                                                formik.values.skills_input.split(
                                                    ","
                                                );

                                            newskills.forEach((role) => {
                                                if (!skills.includes(role)) {
                                                    skills.push(role.trim());
                                                }
                                            });

                                            formik.setFieldValue(
                                                "skills",
                                                skills
                                            );

                                            formik.setFieldValue(
                                                "skills_input",
                                                ""
                                            );
                                        }
                                    }}
                                >
                                    <TextField
                                        label="Skills"
                                        placeholder="PHP, Laravel, JavaScript"
                                        value={formik.values.skills_input}
                                        error={formik.errors.skills}
                                        onChange={(value) =>
                                            formik.setFieldValue(
                                                "skills_input",
                                                value
                                            )
                                        }
                                    />
                                </div>
                                <LegacyStack alignment="center" spacing="tight">
                                    {formik.values.skills.map((role, index) => (
                                        <Tag
                                            key={index}
                                            onRemove={() => {
                                                const skills =
                                                    formik.values.skills.filter(
                                                        (r) => r !== role
                                                    );

                                                formik.setFieldValue(
                                                    "skills",
                                                    skills
                                                );
                                            }}
                                        >
                                            {role}
                                        </Tag>
                                    ))}
                                </LegacyStack>
                            </LegacyStack>
                        </FormLayout>
                    </LegacyCard>
                </Layout.Section>

                {additionalSettingsMarkup}
            </Layout>
        </Page>
    );
}
