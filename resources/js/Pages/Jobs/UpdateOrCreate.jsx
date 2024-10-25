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
    EmptyState,
    Modal,
    Badge,
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

    const [findingTalents, setFindingTalents] = useState(false);
    const [suggestedTalents, setSuggestedTalents] = useState([]);
    const [matchingTalentModalOpen, setMatchingTalentModalOpen] =
        useState(false);
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
            skills_input: "",
            skills: [],
        },
        onSubmit: (values) => {
            const request = id
                ? axios.put(`/job-lists/${id}`, values)
                : axios.post("/job-lists", values);

            request
                .then(() => {
                    navigate("/jobs");
                })
                .catch((error) => {
                    formik.setErrors(error.response.data.errors);
                });
        },
    });

    const fetchProjects = useCallback(() => {
        axios.get("/projects").then((response) => {
            setProjects(response.data);
        });
    }, [formik.values.project_id]);

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
        setAssistantLoading("job_skills");

        runAssistant(
            "asst_4Q1JWG7Rg51Wxlgy28r5JR6U",
            JSON.stringify({
                job_title: formik.values.title,
                job_description: formik.values.description,
            })
        )
            .then((response) => {
                const skills = [...formik.values.skills];
                console.log(response.data.result);

                response.data.result.skills.forEach((role) => {
                    if (!skills.includes(role)) {
                        skills.push(role);
                    }
                });

                formik.setFieldValue("skills", skills);
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

    const fetchSingleJob = useCallback(() => {
        axios.get(`/job-lists/${id}`).then((response) => {
            const project = response.data;

            formik.setValues({ ...project });
        });
    }, [id]);

    useEffect(() => {
        if (matchingTalentModalOpen) {
            setFindingTalents(true);
            setSuggestedTalents([]);

            axios
                .post("/job-lists/find-talents", {
                    job_id: id,
                })
                .then((response) => {
                    setSuggestedTalents(response.data);
                })
                .finally(() => {
                    setFindingTalents(false);
                });
        }
    }, [matchingTalentModalOpen]);

    useEffect(() => {
        fetchProjects();

        if (id) {
            fetchSingleJob();
        }
    }, []);

    const additionalSettingsMarkup = (
        <Layout.Section variant="oneThird">
            <LegacyCard title="Additional information" sectioned>
                <p>123</p>
            </LegacyCard>
        </Layout.Section>
    );

    const jobListMarkup = (
        <Layout.Section variant="oneThird">
            <LegacyCard
                title="Talents"
                actions={[
                    {
                        content: "Find talents",
                        onAction: () => setMatchingTalentModalOpen(true),
                    },
                ]}
            >
                <ResourceList
                    items={[]}
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
                                    options={[
                                        {
                                            label: "No project",
                                            value: "",
                                        },
                                    ].concat(
                                        projects.map((project) => ({
                                            label: project.name,
                                            value: project.id,
                                        }))
                                    )}
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
                                        disabled={
                                            assistantLoading === "job_skills"
                                        }
                                        value={formik.values.skills_input}
                                        error={formik.errors.skills}
                                        onChange={(value) =>
                                            formik.setFieldValue(
                                                "skills_input",
                                                value
                                            )
                                        }
                                        suffix={
                                            !!formik.values.title &&
                                            !!formik.values.description ? (
                                                <Button
                                                    loading={
                                                        assistantLoading ===
                                                        "job_skills"
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

                {id ? jobListMarkup : additionalSettingsMarkup}
            </Layout>

            <Modal
                open={matchingTalentModalOpen}
                title="Find talents"
                onClose={() => setMatchingTalentModalOpen(false)}
            >
                {findingTalents ? (
                    <EmptyState
                        heading="We're finding the best talents for you"
                        image="https://admin.assets.codexapps.co/uploads/codexapps/66e421674d926402130953-1726226822.gif"
                    >
                        <p>
                            We are currently finding the best talents for you
                            based on the job description you provided. This may
                            take a while.
                        </p>
                    </EmptyState>
                ) : (
                    <ResourceList
                        emptyState={
                            <EmptyState
                                heading="No talents found"
                                image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
                            >
                                <p>
                                    We couldn't find any talents that match the
                                    job description you provided.
                                </p>
                            </EmptyState>
                        }
                        items={suggestedTalents}
                        renderItem={(item) => {
                            const media = (
                                <Avatar customer size="md" name={item.name} />
                            );

                            return (
                                <ResourceItem
                                    id={item.id}
                                    media={media}
                                    shortcutActions={[
                                        {
                                            content: "View profile",
                                            onAction: () =>
                                                window.open(
                                                    `/dashboard/talents/${item.id}`,
                                                    "_blank"
                                                ),
                                        },
                                    ]}
                                    persistActions
                                >
                                    <LegacyStack spacing="tight">
                                        <Text
                                            variant="bodyMd"
                                            fontWeight="bold"
                                            as="h3"
                                        >
                                            {item.name}
                                        </Text>
                                        <Badge tone="success">
                                            {item.match_percentage}% match
                                        </Badge>
                                    </LegacyStack>
                                    <div>{item.summary}</div>
                                </ResourceItem>
                            );
                        }}
                    />
                )}
            </Modal>
        </Page>
    );
}
