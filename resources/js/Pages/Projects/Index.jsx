import { Page, MediaCard, VideoThumbnail, InlineGrid } from "@shopify/polaris";
import { useNavigate } from "react-router";
import { EditIcon, ViewIcon } from "@shopify/polaris-icons";
import { useCallback, useEffect, useState } from "react";
import axios from "@/Plugins/axios";

export default function ResourceListExample() {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);

    const fetchProjects = useCallback(() => {
        axios.get("/projects").then((response) => {
            setProjects(response.data);
        });
    }, [setProjects]);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

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
                        key={index}
                        portrait
                        title={project.name}
                        description={project.short_description}
                    >
                        <VideoThumbnail
                            thumbnailUrl={project.thumbnail}
                            onClick={() => navigate(`/projects/${project.id}`)}
                        />
                    </MediaCard>
                ))}
            </InlineGrid>
        </Page>
    );
}
