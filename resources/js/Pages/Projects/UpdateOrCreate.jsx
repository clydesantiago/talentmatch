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
    Checkbox,
    Select,
    Thumbnail,
    Box,
    ResourceItem,
    ResourceList,
    Avatar,
    EmptyState,
    Link,
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
    const navigate = useNavigate();

    const [jobLists, setJobLists] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [assistantLoading, setAssistantLoading] = useState(null);
    const formik = useFormik({
        initialValues: {
            thumbnail: "",
            name: "",
            description: "",
            start_date: new Date().toISOString().split("T")[0],
            end_date: new Date(new Date().getTime() + 31 * 24 * 60 * 60 * 1000)
                .toISOString()
                .split("T")[0],
            company_id: "",
            budget: 1000,
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

    const fetchCompanies = useCallback(() => {
        axios.get("/companies").then((response) => {
            setCompanies(response.data);
        });
    }, [formik.values.company_id]);

    const fetchJobLists = useCallback(() => {
        axios.get(`/projects/${id}/jobs`).then((response) => {
            setJobLists(response.data);
        });
    }, [id]);

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

    const handleGenerateJobRoles = useCallback(() => {
        setAssistantLoading("job_roles");

        runAssistant(
            "asst_zHzzmHIaziZfzsIWNFvHzHBn",
            JSON.stringify({
                project_title: formik.values.name,
                project_description: formik.values.description,
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
            "asst_mdcfesk2JzH0z6KbiFgcuBVu",
            JSON.stringify({
                project_title: formik.values.name,
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
        fetchCompanies();
        fetchJobLists();

        if (id) {
            fetchSingleProject();
        }
    }, []);

    const additionalSettingsMarkup = (
        <Layout.Section variant="oneThird">
            <LegacyCard title="Additional settings" sectioned>
                {!id && (
                    <div>
                        <Checkbox
                            label="Automatically generate job listings"
                            checked={formik.values.generate_job_listings}
                            onChange={(value) =>
                                formik.setFieldValue(
                                    "generate_job_listings",
                                    value
                                )
                            }
                        />

                        {formik.values.generate_job_listings && (
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
                                        label="Job roles"
                                        placeholder="Web developer, Project manager"
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
                                            !!formik.values.name &&
                                            !!formik.values.description ? (
                                                <Button
                                                    loading={
                                                        assistantLoading ===
                                                        "job_roles"
                                                    }
                                                    variant="plain"
                                                    onClick={() =>
                                                        handleGenerateJobRoles()
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
                        )}
                    </div>
                )}
            </LegacyCard>
        </Layout.Section>
    );

    const jobListMarkup = (
        <Layout.Section variant="oneThird">
            <LegacyCard title="Job listings" sectioned={!jobLists.length}>
                <ResourceList
                    emptyState={
                        <Box>
                            <p>
                                No job listings for this project yet.{" "}
                                <Link
                                    onClick={() =>
                                        navigate(
                                            `/jobs/create?project_id=${id}`
                                        )
                                    }
                                >
                                    Click here
                                </Link>{" "}
                                to create one.
                            </p>
                        </Box>
                    }
                    items={jobLists}
                    renderItem={(item) => {
                        const { id, url, title, location } = item;
                        const media = (
                            <Avatar customer size="md" name={title} />
                        );

                        return (
                            <ResourceItem
                                id={id}
                                url={url}
                                media={media}
                                accessibilityLabel={`View details for ${title}`}
                                onClick={() => navigate(`/jobs/${id}`)}
                            >
                                <Text
                                    variant="bodyMd"
                                    fontWeight="bold"
                                    as="h3"
                                >
                                    {title}
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
                onAction: () => navigate("/projects"),
            }}
            title={id ? "Project details" : "Create project"}
            primaryAction={{
                content: "Save project",
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
                                        label="Project name"
                                        placeholder="Inventory management system"
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
                                placeholder="Write a detailed description for your project"
                                multiline={4}
                                value={formik.values.description}
                                error={formik.errors.description}
                                disabled={assistantLoading === "description"}
                                onChange={(value) =>
                                    formik.setFieldValue("description", value)
                                }
                                suffix={
                                    !!formik.values.name && (
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
                                    label="Start date"
                                    type="date"
                                    value={formik.values.start_date}
                                    error={formik.errors.start_date}
                                    onChange={(value) =>
                                        formik.setFieldValue(
                                            "start_date",
                                            value
                                        )
                                    }
                                />
                                <TextField
                                    label="End date"
                                    type="date"
                                    value={formik.values.end_date}
                                    error={formik.errors.end_date}
                                    onChange={(value) =>
                                        formik.setFieldValue("end_date", value)
                                    }
                                />
                            </FormLayout.Group>
                            <FormLayout.Group>
                                <Select
                                    label="Company"
                                    options={companies.map((company) => ({
                                        label: company.name,
                                        value: company.id,
                                    }))}
                                    value={formik.values.company_id}
                                    error={formik.errors.company_id}
                                    onChange={(value) =>
                                        formik.setFieldValue(
                                            "company_id",
                                            Number(value)
                                        )
                                    }
                                />
                                <TextField
                                    label="Budget"
                                    type="number"
                                    prefix="$"
                                    value={formik.values.budget}
                                    error={formik.errors.budget}
                                    onChange={(value) =>
                                        formik.setFieldValue("budget", value)
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
