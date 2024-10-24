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

export default function Create() {
    const uploadInputRef = useRef(null);
    const messagesRef = useRef(null);
    const navigate = useNavigate();

    const [companies, setCompanies] = useState([]);

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
            budget: "",
            generate_job_listings: true,
            roles: "",
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

    const [messages, setMessages] = useState([
        {
            role: "system",
            content: [
                {
                    text: 'As a product manager, engage the user to gather essential details about their project. You will ask up to 5 questions to ensure you have a comprehensive understanding of their requirements. Specifically, inquire about the project description, start date and deadline, and skills needed.\n\n# Steps\n\n1. **Project Description**: Ask the user to describe the project they wish to create in detail.\n2. **Start Date and Deadline**: Query the expected start date and the project\'s deadline.\n3. **Skills Needed**: Inquire about the specific skills or expertise required for the project.\n4. **Clarification**: If the user\'s responses lack clarity or essential details, politely ask follow-up questions or seek clarification.\n\n# Output Format\n\nFormat your questions and follow-up inquiries as clear and concise sentences, addressing each required detail separately. Reiterate the importance of each piece of information, encouraging complete and specific answers. Ask 1 question at a time only.\n\n# Examples\n\n**Example 1:**\n- **Input from User**: "I want to create a mobile app for fitness tracking."\n- **Your Questions**:\n  - "Can you describe the specific features and objectives of your fitness tracking app?"\n  - "What is your planned start date, and by when do you aim to complete the project?"\n  - "What technical or design skills are necessary for this app development?"\n\n**Example 2:**\n- **Input from User**: "Need help with a marketing campaign."\n- **Your Questions**:\n  - "Could you elaborate on the goals and scope of your marketing campaign?"\n  - "When do you plan to start, and what is the campaign\'s deadline?"\n  - "Are there any specific marketing or SEO skills required for this campaign?"\n\n(Ensure real user interactions may require additional probing for complete responses.)\n\n# Notes\n\n- Ensure questions are respectful and encouraging to promote a thorough and honest conversation.\n- Be prepared to assist the user in identifying potential skills or dates they might be uncertain about.\n- If the details are clear already. Ask the user if there\'s anything else they want to add. If not, ask the questions needed again.\n- If everything is okay, and the user do not want to add anything, then reply the full project details, and at the end of your message, append "CONVERSATION_FINISHED"',
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
        {
            role: "user",
            content: [
                {
                    text: "I want to build a mobile app for fitness tracking.",
                    type: "text",
                },
            ],
        },
    ]);

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

    useEffect(() => {
        fetchCompanies();
    }, [fetchCompanies]);

    return (
        <Page
            backAction={{
                content: "Back",
                onAction: () => navigate("/projects"),
            }}
            title="Create a project"
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
                                        placeholder="Inventory Management"
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
                                onChange={(value) =>
                                    formik.setFieldValue("description", value)
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
                                    label="Client"
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
                                    <TextField
                                        label="Roles"
                                        placeholder="Web developer, Project manager"
                                        value={formik.values.roles}
                                        error={formik.errors.roles}
                                        onChange={(value) =>
                                            formik.setFieldValue("roles", value)
                                        }
                                        onKeyPress={(event) => {
                                            if (event.key === "Enter") {
                                                formik.setFieldValue(
                                                    "roles",
                                                    `${formik.values.roles}, `
                                                );
                                            }
                                        }}
                                    />
                                    <LegacyStack
                                        alignment="center"
                                        spacing="tight"
                                    >
                                        <Tag onRemove={() => {}}>
                                            Web developer
                                        </Tag>
                                        <Tag onRemove={() => {}}>
                                            Project manager
                                        </Tag>
                                    </LegacyStack>
                                </LegacyStack>
                            )}
                        </FormLayout>
                    </LegacyCard>
                </Layout.Section>
                <Layout.Section variant="oneThird">
                    <LegacyCard
                        title={
                            <LegacyStack
                                spacing="extraTight"
                                alignment="center"
                            >
                                <Text variant="headingSm" as="h6" tone="magic">
                                    Generate with AI
                                </Text>
                                <Icon tone="magic" source={MagicIcon} />
                            </LegacyStack>
                        }
                        sectioned
                    >
                        <div
                            ref={messagesRef}
                            style={{
                                height: "300px",
                                overflowY: "auto",
                            }}
                        >
                            {filteredMessages.map((message, index) => (
                                <div
                                    key={index}
                                    style={{
                                        marginRight:
                                            message.role === "assistant"
                                                ? "30px"
                                                : "0",
                                        marginLeft:
                                            message.role === "user"
                                                ? "30px"
                                                : "0",

                                        marginBottom: "10px",
                                        display: "flex",
                                        justifyContent:
                                            message.role === "assistant"
                                                ? "flex-start"
                                                : "flex-end",
                                    }}
                                >
                                    {message.content.map((content, index) => {
                                        if (content.type === "text") {
                                            return (
                                                <Badge
                                                    key={index}
                                                    size="large"
                                                    tone={
                                                        message.role ===
                                                        "assistant"
                                                            ? ""
                                                            : "info"
                                                    }
                                                >
                                                    {content.text}
                                                </Badge>
                                            );
                                        }
                                    })}
                                </div>
                            ))}
                        </div>
                        <TextField
                            labelHidden
                            placeholder="Type your message here"
                            multiline
                            suffix={
                                <div style={{ marginTop: "5px" }}>
                                    <Button icon={SendIcon} variant="plain" />
                                </div>
                            }
                        />
                    </LegacyCard>
                </Layout.Section>
            </Layout>
        </Page>
    );
}
