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
    Spinner,
    ResourceItem,
    ResourceList,
    Avatar,
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
import { useNavigate, useParams } from "react-router-dom";
import { ImageIcon } from "@shopify/polaris-icons";

export default function Create() {
    const { id } = useParams();
    const uploadInputRef = useRef(null);
    const messagesRef = useRef(null);
    const navigate = useNavigate();

    const [companies, setCompanies] = useState([]);
    const [assistantLoading, setAssistantLoading] = useState(null);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([
        {
            role: "system",
            content: [
                {
                    text: "Act as a helpful product manager by addressing user queries accurately and using any relevant metadata from the form they are filling out to enhance your response.\n\n# Steps\n\n1. **Read the User Query**: Understand the question or informational need expressed by the user.\n2. **Assess Metadata**: Examine the metadata provided to identify any relevant context or information that might aid in formulating a precise answer.\n3. **Formulate a Response**: Integrate insights from the metadata and general product knowledge to craft a comprehensive and helpful answer to the user query.\n4. **Verify Accuracy**: Ensure the response is accurate and directly addresses the user's question or issue.\n\n# Output Format\n\nThe response should be a well-structured paragraph that fully addresses the user's query, incorporating metadata where applicable to provide a complete and informed answer. Use clear and professional language.\n\n# Notes\n\n- If the metadata contains sensitive information, ensure it is handled appropriately and is not disclosed unnecessarily in your response.\n- Aim to add value by leveraging the metadata, but do not rely on it exclusively if the user's query can be answered independently.\n- Keep responses concise but comprehensive, avoiding unnecessary jargon or overly technical explanations unless specifically requested.",
                    type: "text",
                },
            ],
        },
        {
            role: "assistant",
            content: [
                {
                    text: "Hey there! I'm your AI assistant, here to help you create a project. Let's get started! 🚀\n\nCan you please describe the project you wish to create in detail?",
                    type: "text",
                },
            ],
        },
    ]);

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
            axios
                .post("/projects", values)
                .then(() => {
                    navigate("/projects");
                })
                .catch((error) => {
                    formik.setErrors(error.response.data.errors);
                });
        },
    });

    const filteredMessages = useMemo(() => {
        return messages.filter((message) => message.role !== "system");
    });

    const fetchCompanies = useCallback(() => {
        axios.get("/companies").then((response) => {
            setCompanies(response.data);

            const firstCompany = response.data[0];
            formik.setFieldValue("company_id", firstCompany.id);
        });
    }, [formik.values.company_id]);

    const handleScroll = useCallback(() => {
        setTimeout(() => {
            const htmlMessages = messagesRef.current;

            htmlMessages.scrollTo({
                top: htmlMessages.scrollHeight,
                behavior: "smooth",
            });
        }, 100);
    }, [messagesRef]);

    const handleSendMessage = useCallback(() => {
        if (!message) {
            return;
        }

        const currentMessages = [...messages];
        const metaData = {
            project: {
                ...formik.values,
            },
        };
        const newMessage = {
            role: "user",
            content: [
                {
                    text: `${message} \n \n # Metadata \n ${JSON.stringify(
                        metaData
                    )}`,
                    type: "text",
                },
            ],
        };

        currentMessages.push(newMessage);

        setAssistantLoading(true);
        setMessages(currentMessages);
        setMessage("");
        handleScroll();

        axios
            .post("/openai", { messages: currentMessages })
            .then((response) => {
                const assistantMessage = {
                    role: "assistant",
                    content: [
                        {
                            text: response.data.message,
                            type: "text",
                        },
                    ],
                };

                currentMessages.push(assistantMessage);
                console.log(currentMessages);

                setMessages(currentMessages);
            })
            .finally(() => {
                setAssistantLoading(false);
                handleScroll();
            });
    }, [message, messagesRef]);

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

    useEffect(() => {
        fetchCompanies();
    }, [fetchCompanies]);

    // const aiChatboxMarkup = (
    //     <Layout.Section variant="oneThird">
    //         <LegacyCard
    //             title={
    //                 <LegacyStack spacing="extraTight" alignment="center">
    //                     <Text variant="headingSm" as="h6" tone="magic">
    //                         Generate with AI
    //                     </Text>
    //                     <Icon tone="magic" source={MagicIcon} />
    //                 </LegacyStack>
    //             }
    //             sectioned
    //         >
    //             <div
    //                 ref={messagesRef}
    //                 style={{
    //                     height: "300px",
    //                     overflowY: "auto",
    //                 }}
    //             >
    //                 {filteredMessages.map((message, index) => (
    //                     <div
    //                         key={index}
    //                         style={{
    //                             marginRight:
    //                                 message.role === "assistant" ? "30px" : "0",
    //                             marginLeft:
    //                                 message.role === "user" ? "30px" : "0",

    //                             marginBottom: "10px",
    //                             display: "flex",
    //                             justifyContent:
    //                                 message.role === "assistant"
    //                                     ? "flex-start"
    //                                     : "flex-end",
    //                         }}
    //                     >
    //                         {message.content.map((content, index) => {
    //                             if (content.type === "text") {
    //                                 return (
    //                                     <Badge
    //                                         key={index}
    //                                         size="large"
    //                                         tone={
    //                                             message.role === "assistant"
    //                                                 ? ""
    //                                                 : "info"
    //                                         }
    //                                     >
    //                                         {content.text}
    //                                     </Badge>
    //                                 );
    //                             }
    //                         })}
    //                     </div>
    //                 ))}
    //             </div>
    //             <div
    //                 onKeyDown={(event) => {
    //                     if (event.key === "Enter") {
    //                         handleSendMessage();
    //                     }
    //                 }}
    //             >
    //                 <TextField
    //                     labelHidden
    //                     placeholder="Type your message here"
    //                     suffix={
    //                         <div style={{ marginTop: "5px" }}>
    //                             {!assistantLoading ? (
    //                                 <Button
    //                                     icon={SendIcon}
    //                                     variant="plain"
    //                                     onClick={handleSendMessage}
    //                                 />
    //                             ) : (
    //                                 <Spinner size="small" />
    //                             )}
    //                         </div>
    //                     }
    //                     value={message}
    //                     onChange={(value) => setMessage(value)}
    //                 />
    //             </div>
    //         </LegacyCard>
    //     </Layout.Section>
    // );

    const aiChatboxMarkup2 = (
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
                onAction: () => navigate("/projects"),
            }}
            title={id ? "Project details" : "Create project"}
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
                                            value
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

                {id ? jobListMarkup : aiChatboxMarkup2}
            </Layout>
        </Page>
    );
}
