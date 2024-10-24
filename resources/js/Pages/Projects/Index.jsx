import { Page, MediaCard, VideoThumbnail, InlineGrid } from "@shopify/polaris";
import { useNavigate } from "react-router";
import { EditIcon, ViewIcon } from "@shopify/polaris-icons";

export default function ResourceListExample() {
    const navigate = useNavigate();

    const projects = [
        {
            id: 1,
            title: "Rainbow",
            shortDescription:
                "A new way to shop for furniture. Const consequat veniam occaecat do.Non ais irure ut Lorem ad id.",
        },
        {
            id: 2,
            title: "Rainbow",
            shortDescription:
                "A new way to shop for furniture. Const consequat veniam occaecat do.Non ais irure ut Lorem ad id.",
        },
        {
            id: 3,
            title: "Rainbow",
            shortDescription:
                "A new way to shop for furniture. Const consequat veniam occaecat do.Non ais irure ut Lorem ad id.",
        },
        {
            id: 4,
            title: "Rainbow",
            shortDescription:
                "A new way to shop for furniture. Const consequat veniam occaecat do.Non ais irure ut Lorem ad id.",
        },
        {
            id: 5,
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
                            content: "View",
                            icon: ViewIcon,
                            onAction: () => navigate(`/projects/${project.id}`),
                        }}
                        secondaryAction={{
                            content: "Edit",
                            icon: EditIcon,
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
