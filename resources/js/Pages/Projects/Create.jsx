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
    Label,
    Select,
} from "@shopify/polaris";
import { SendIcon, MagicIcon } from "@shopify/polaris-icons";
import React, { useMemo, useRef, useState } from "react";

export default function Example() {
    const messagesRef = useRef(null);

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

    return (
        <Page title="Create a project">
            <Layout>
                <Layout.Section>
                    <LegacyCard sectioned>
                        <FormLayout>
                            <TextField
                                label="Project name"
                                placeholder="Inventory Management"
                            />
                            <TextField
                                label="Description"
                                placeholder="Write a detailed description for your project"
                                multiline={4}
                            />
                            <FormLayout.Group>
                                <TextField label="Start date" type="date" />
                                <TextField label="End date" type="date" />
                            </FormLayout.Group>
                            <FormLayout.Group>
                                <Select
                                    label="Client"
                                    options={[
                                        {
                                            label: "John Doe",
                                            value: "john-doe",
                                        },
                                        {
                                            label: "Jane Doe",
                                            value: "jane-doe",
                                        },
                                    ]}
                                />
                                <TextField
                                    label="Budget"
                                    type="number"
                                    prefix="$"
                                />
                            </FormLayout.Group>
                            <LegacyStack vertical spacing="tight">
                                <TextField
                                    label="Roles"
                                    placeholder="Web developer"
                                />
                                <LegacyStack alignment="center" spacing="tight">
                                    <Tag onRemove={() => {}}>Web developer</Tag>
                                    <Tag onRemove={() => {}}>
                                        Project manager
                                    </Tag>
                                </LegacyStack>
                            </LegacyStack>
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
