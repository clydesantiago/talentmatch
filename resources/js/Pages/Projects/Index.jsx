import { Page, MediaCard, VideoThumbnail, InlineGrid } from "@shopify/polaris";
import { useNavigate } from "react-router";

export default function ResourceListExample() {
    const navigate = useNavigate();

    const projects = [
        {
            title: "Rainbow",
            shortDescription:
                "A new way to shop for furniture. Const consequat veniam occaecat do.Non ais irure ut Lorem ad id.",
        },
        {
            title: "Rainbow",
            shortDescription:
                "A new way to shop for furniture. Const consequat veniam occaecat do.Non ais irure ut Lorem ad id.",
        },
        {
            title: "Rainbow",
            shortDescription:
                "A new way to shop for furniture. Const consequat veniam occaecat do.Non ais irure ut Lorem ad id.",
        },
        {
            title: "Rainbow",
            shortDescription:
                "A new way to shop for furniture. Const consequat veniam occaecat do.Non ais irure ut Lorem ad id.",
        },
        {
            title: "Rainbow",
            shortDescription:
                "A new way to shop for furniture. Const consequat veniam occaecat do.Non ais irure ut Lorem ad id.",
        },
    ];

    return (
        <Page
            title="Projects"
            primaryAction={{
                content: "Create a project",
                onAction: () => navigate("create"),
            }}
        >
            <InlineGrid gap="400" columns={3}>
                {projects.map((project, index) => (
                    <MediaCard
                        portrait
                        title={project.title}
                        primaryAction={{
                            content: "Learn more",
                            onAction: () => {},
                        }}
                        description={project.shortDescription}
                        popoverActions={[
                            { content: "Dismiss", onAction: () => {} },
                        ]}
                    >
                        <VideoThumbnail
                            videoLength={80}
                            thumbnailUrl="https://burst.shopifycdn.com/photos/business-woman-smiling-in-office.jpg?width=1850"
                            onClick={() => console.log("clicked")}
                        />
                    </MediaCard>
                ))}
            </InlineGrid>
        </Page>
    );
}
