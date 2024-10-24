import {
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
    Select,
    Thumbnail,
    Box,
    ResourceItem,
    ResourceList,
    Avatar,
} from "@shopify/polaris";
import { MagicIcon } from "@shopify/polaris-icons";
import { useFormik } from "formik";
import React, { useCallback, useEffect, useRef, useState } from "react";
import axios from "@/Plugins/axios";
import { useNavigate, useParams } from "react-router-dom";
import { ImageIcon } from "@shopify/polaris-icons";

export default function Create() {
    const { id } = useParams();
    const uploadInputRef = useRef(null);
    const messagesRef = useRef(null);
    const navigate = useNavigate();

    const [projects, setProjects] = useState([]);
    const [assistantLoading, setAssistantLoading] = useState(null);
    const formik = useFormik({
        initialValues: {
            thumbnail: "",
            title: "",
            description: "",
            minimum_salary: "",
            maximum_salary: "",
            project_id: "",
            years_of_experience: "",
            generate_job_listings: true,
            roles_input: "",
            roles: [],
        },
        onSubmit: (values) => {
            const request = id
                ? axios.put(`/projects/${id}`, values)
                : axios.post("/projects", values);

            request
                .then(() => {
                    navigate("/projects");
                })
                .catch((error) => {
                    formik.setErrors(error.response.data.errors);
                });
        },
    });

    const fetchProjects = useCallback(() => {
        axios.get("/projects").then((response) => {
            setProjects(response.data);

            const firstProject = response.data[0];
            formik.setFieldValue("project_id", firstProject.id);
        });
    }, [formik.values.project_id]);

    const handleScroll = useCallback(() => {
        setTimeout(() => {
            const htmlMessages = messagesRef.current;

            htmlMessages.scrollTo({
                top: htmlMessages.scrollHeight,
                behavior: "smooth",
            });
        }, 100);
    }, [messagesRef]);

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

    const runAssistant = useCallback((assitantId, message) => {
        return axios.post("/run-assistant", {
            assistant_id: assitantId,
            message: message,
        });
    }, []);

    const handleGenerateSkills = useCallback(() => {
        setAssistantLoading("job_roles");

        runAssistant(
            "asst_4Q1JWG7Rg51Wxlgy28r5JR6U",
            JSON.stringify({
                job_title: formik.values.title,
                job_description: formik.values.description,
            })
        )
            .then((response) => {
                const roles = [...formik.values.roles];
                console.log(response.data.result);

                response.data.result.roles.forEach((role) => {
                    if (!roles.includes(role)) {
                        roles.push(role);
                    }
                });

                formik.setFieldValue("roles", roles);
            })
            .finally(() => {
                setAssistantLoading(null);
            });
    }, [formik.values]);

    const handleGenerateDescription = useCallback(() => {
        setAssistantLoading("description");

        runAssistant(
            "asst_zrCOGFokVBWYixfme8fPLxWP",
            JSON.stringify({
                job_title: formik.values.title,
            })
        )
            .then((response) => {
                formik.setFieldValue("description", response.data.result);
            })
            .finally(() => {
                setAssistantLoading(null);
            });
    }, [formik.values]);

    const fetchSingleProject = useCallback(() => {
        axios.get(`/projects/${id}`).then((response) => {
            const project = response.data;

            formik.setValues({ ...project });
        });
    }, [id]);

    useEffect(() => {
        fetchProjects();

        if (id) {
            fetchSingleProject();
        }
    }, []);

    const additionalSettingsMarkup = (
        <Layout.Section variant="oneThird">
            <LegacyCard title="Additional information" sectioned>
                {!id && (
                    <div>
                        {
                            <LegacyStack vertical spacing="tight">
                                <div
                                    onKeyPress={(event) => {
                                        if (event.key === "Enter") {
                                            const roles = [
                                                ...formik.values.roles,
                                            ];

                                            const newRoles =
                                                formik.values.roles_input.split(
                                                    ","
                                                );

                                            newRoles.forEach((role) => {
                                                if (!roles.includes(role)) {
                                                    roles.push(role.trim());
                                                }
                                            });

                                            formik.setFieldValue(
                                                "roles",
                                                roles
                                            );

                                            formik.setFieldValue(
                                                "roles_input",
                                                ""
                                            );
                                        }
                                    }}
                                >
                                    <TextField
                                        label="Skills"
                                        placeholder="PHP, Laravel, JavaScript"
                                        disabled={
                                            assistantLoading === "job_roles"
                                        }
                                        value={formik.values.roles_input}
                                        error={formik.errors.roles}
                                        onChange={(value) =>
                                            formik.setFieldValue(
                                                "roles_input",
                                                value
                                            )
                                        }
                                        suffix={
                                            !!formik.values.title &&
                                            !!formik.values.description ? (
                                                <Button
                                                    loading={
                                                        assistantLoading ===
                                                        "job_roles"
                                                    }
                                                    variant="plain"
                                                    onClick={() =>
                                                        handleGenerateSkills()
                                                    }
                                                >
                                                    {!assistantLoading && (
                                                        <Icon
                                                            source={MagicIcon}
                                                            tone="magic"
                                                        />
                                                    )}
                                                </Button>
                                            ) : null
                                        }
                                    />
                                </div>
                                <LegacyStack alignment="center" spacing="tight">
                                    {formik.values.roles.map((role, index) => (
                                        <Tag
                                            key={index}
                                            onRemove={() => {
                                                const roles =
                                                    formik.values.roles.filter(
                                                        (r) => r !== role
                                                    );

                                                formik.setFieldValue(
                                                    "roles",
                                                    roles
                                                );
                                            }}
                                        >
                                            {role}
                                        </Tag>
                                    ))}
                                </LegacyStack>
                            </LegacyStack>
                        }
                    </div>
                )}
            </LegacyCard>
        </Layout.Section>
    );

    const jobListMarkup = (
        <Layout.Section variant="oneThird">
            <LegacyCard title="Job listings">
                <ResourceList
                    resourceName={{ singular: "customer", plural: "customers" }}
                    items={[
                        {
                            id: "100",
                            url: "#",
                            name: "Mae Jemison",
                            location: "Decatur, USA",
                        },
                        {
                            id: "200",
                            url: "#",
                            name: "Ellen Ochoa",
                            location: "Los Angeles, USA",
                        },
                    ]}
                    renderItem={(item) => {
                        const { id, url, name, location } = item;
                        const media = <Avatar customer size="md" name={name} />;

                        return (
                            <ResourceItem
                                id={id}
                                url={url}
                                media={media}
                                accessibilityLabel={`View details for ${name}`}
                            >
                                <Text
                                    variant="bodyMd"
                                    fontWeight="bold"
                                    as="h3"
                                >
                                    {name}
                                </Text>
                                <div>{location}</div>
                            </ResourceItem>
                        );
                    }}
                />
            </LegacyCard>
        </Layout.Section>
    );

    return (
        <Page
            backAction={{
                content: "Back",
                onAction: () => navigate("/jobs"),
            }}
            title={id ? "Job details" : "Create job"}
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
                                        label="Job title"
                                        placeholder="Laravel developer"
                                        value={formik.values.title}
                                        error={formik.errors.title}
                                        onChange={(value) =>
                                            formik.setFieldValue("title", value)
                                        }
                                    />
                                </LegacyStack.Item>
                                <Box paddingBlockStart={100}>
                                    <input
                                        accept="image/*"
                                        type="file"
                                        ref={uploadInputRef}
                                        style={{ display: "none" }}
                                        onChange={handleThumbnailUpload}
                                    />
                                    <Button
                                        variant="plain"
                                        onClick={() => {
                                            uploadInputRef.current.click();
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
                                label="Description"
                                placeholder="Write a detailed description for the job"
                                multiline={4}
                                value={formik.values.description}
                                error={formik.errors.description}
                                disabled={assistantLoading === "description"}
                                onChange={(value) =>
                                    formik.setFieldValue("description", value)
                                }
                                suffix={
                                    !!formik.values.title && (
                                        <div style={{ marginTop: "-35px" }}>
                                            <Button
                                                loading={
                                                    assistantLoading ===
                                                    "description"
                                                }
                                                variant="plain"
                                                onClick={() =>
                                                    handleGenerateDescription()
                                                }
                                            >
                                                {!assistantLoading && (
                                                    <Icon
                                                        source={MagicIcon}
                                                        tone="magic"
                                                    />
                                                )}
                                            </Button>
                                        </div>
                                    )
                                }
                            />
                            <FormLayout.Group>
                                <TextField
                                    label="Minimum salary"
                                    placeholder="1000"
                                    prefix="$"
                                    value={formik.values.minimum_salary}
                                    error={formik.errors.minimum_salary}
                                    onChange={(value) =>
                                        formik.setFieldValue(
                                            "minimum_salary",
                                            value
                                        )
                                    }
                                />
                                <TextField
                                    label="Maximum salary"
                                    placeholder="2000"
                                    prefix="$"
                                    value={formik.values.maximum_salary}
                                    error={formik.errors.maximum_salary}
                                    onChange={(value) =>
                                        formik.setFieldValue(
                                            "maximum_salary",
                                            value
                                        )
                                    }
                                />
                            </FormLayout.Group>

                            <FormLayout.Group>
                                <Select
                                    label="Project"
                                    options={projects.map((project) => ({
                                        label: project.name,
                                        value: project.id,
                                    }))}
                                    value={formik.values.project_id}
                                    error={formik.errors.project_id}
                                    onChange={(value) =>
                                        formik.setFieldValue(
                                            "project_id",
                                            Number(value)
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
                        </FormLayout>
                    </LegacyCard>
                </Layout.Section>

                {id ? jobListMarkup : additionalSettingsMarkup}
            </Layout>
        </Page>
    );
}
