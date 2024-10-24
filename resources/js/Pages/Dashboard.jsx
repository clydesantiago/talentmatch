import { useState } from "react";
import { Button, Page } from "@shopify/polaris";
import SetupGuide from "@/Components/SetupGuide";

const Example = () => {
    const [showGuide, setShowGuide] = useState(true);
    const [items, setItems] = useState(ITEMS);

    // Example of step complete handler, adjust for your use case
    const onStepComplete = async (id) => {
        try {
            // API call to update completion state in DB, etc.
            await new Promise((res) =>
                setTimeout(() => {
                    res();
                }, [1000])
            );

            setItems((prev) =>
                prev.map((item) =>
                    item.id === id
                        ? { ...item, complete: !item.complete }
                        : item
                )
            );
        } catch (e) {
            console.error(e);
        }
    };

    if (!showGuide)
        return (
            <Button onClick={() => setShowGuide(true)}>Show Setup Guide</Button>
        );

    return (
        <Page>
            <SetupGuide
                onDismiss={() => {
                    setShowGuide(false);
                    setItems(ITEMS);
                }}
                onStepComplete={onStepComplete}
                items={items}
            />
        </Page>
    );
};

// EXAMPLE DATA - COMPONENT API
const ITEMS = [
    {
        id: 0,
        title: "Add your first project",
        description:
            "Add your first project to get started. You can add a project by generating with the help of AI or create a project manually.",
        image: {
            url: "https://cdn.shopify.com/shopifycloud/shopify/assets/admin/home/onboarding/shop_pay_task-70830ae12d3f01fed1da23e607dc58bc726325144c29f96c949baca598ee3ef6.svg",
            alt: "Illustration highlighting ShopPay integration",
        },
        complete: false,
        primaryButton: {
            content: "Create project",
            props: {
                onAction: () => console.log("create project!"),
                external: true,
            },
        },
    },
    {
        id: 1,
        title: "Post a job",
        description:
            "After you've added your first project, post a job to get started. You can post a job by generating with the help of AI or create a job manually.",
        image: {
            url: "https://cdn.shopify.com/shopifycloud/shopify/assets/admin/home/onboarding/detail-images/home-onboard-share-store-b265242552d9ed38399455a5e4472c147e421cb43d72a0db26d2943b55bdb307.svg",
            alt: "Illustration showing an online storefront with a 'share' icon in top right corner",
        },
        complete: false,
        primaryButton: {
            content: "Post a job",
            props: {
                onAction: () => console.log("copied store link!"),
            },
        },
    },
    {
        id: 2,
        title: "Find talents",
        description:
            "After you've posted a job, find talents to get started. You can find talents by generating with the help of AI or create a job manually.",
        image: {
            url: "https://cdn.shopify.com/b/shopify-guidance-dashboard-public/nqjyaxwdnkg722ml73r6dmci3cpn.svgz",
        },
        complete: false,
        primaryButton: {
            content: "Find talents",
            props: {
                url: "https://www.example.com",
                external: true,
            },
        },
    },
];

export default Example;
