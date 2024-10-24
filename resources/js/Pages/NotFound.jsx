import {
    Badge,
    Button,
    FormLayout,
    LegacyCard,
    Page,
    TextField,
} from "@shopify/polaris";
import axios from "@/Plugins/axios";
import OpenAI from "openai";
import { useCallback, useMemo, useRef, useState } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router";

export default function NotFound() {
    const navigate = useNavigate();
    const messagesRef = useRef(null);
    const [message, setMessage] = useState("");

    const formik = useFormik({
        initialValues: {
            title: "",
            startDate: "",
            endDate: "",
            skills: [],
            description: "",
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
    ]);

    const handleAxios = useCallback(async () => {
        const newMessages = [...messages];
        newMessages.push({
            role: "user",
            content: [
                {
                    text: message,
                    type: "text",
                },
            ],
        });

        setMessages(newMessages);
        setMessage("");

        const openai = new OpenAI({
            dangerouslyAllowBrowser: true,
        });
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: newMessages,
            temperature: 1,
            max_tokens: 2048,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            response_format: {
                type: "text",
            },
        });

        console.log(response);

        const newMessages2 = [...newMessages];
        newMessages2.push({
            role: response.choices[0].message.role,
            content: [
                {
                    text: response.choices[0].message.content,
                    type: "text",
                },
            ],
        });

        setMessages(newMessages2);
    }, [message, messages]);

    const filteredMessages = useMemo(() => {
        return messages.filter((message) => message.role !== "system");
    });

    return (
        <Page
            title="Create a project"
            backAction={{
                content: "Back",
                onAction: () => navigate("/projects"),
            }}
        >
            <LegacyCard
                sectioned
                title="Create a new project"
                primaryFooterAction={{
                    content: "Submit",
                    onAction: handleAxios,
                }}
            >
                <FormLayout>
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
                                                    message.role === "assistant"
                                                        ? ""
                                                        : "info"
                                                }
                                            >
                                                {message.role} -{content.text}
                                            </Badge>
                                        );
                                    }
                                })}
                            </div>
                        ))}
                    </div>
                    <TextField
                        label="Describe your project"
                        value={message}
                        onChange={(value) => setMessage(value)}
                    />
                </FormLayout>
            </LegacyCard>
        </Page>
    );
}
