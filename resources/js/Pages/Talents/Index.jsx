import { Page, MediaCard, VideoThumbnail, InlineGrid } from "@shopify/polaris";
import { useNavigate } from "react-router";
import { EditIcon, ViewIcon } from "@shopify/polaris-icons";
import { useCallback, useEffect, useState } from "react";
import axios from "@/Plugins/axios";

export default function ResourceListExample() {
    const navigate = useNavigate();
    const [talents, setTalents] = useState([]);

    const fetchTalents = useCallback(() => {
        axios.get("/talents").then((response) => {
            setTalents(response.data);
        });
    }, [setTalents]);

    useEffect(() => {
        fetchTalents();
    }, [fetchTalents]);

    return (
        <Page
            title="Talents"
            primaryAction={{
                content: "Create talent",
                onAction: () => navigate("create"),
            }}
        >
            <InlineGrid gap="400" columns={3}>
                {talents.map((talent, index) => (
                    <MediaCard
                        key={index}
                        portrait
                        title={talent.name}
                        description={talent.summary}
                    >
                        <VideoThumbnail
                            thumbnailUrl={talent.thumbnail}
                            onClick={() => navigate(`/talents/${talent.id}`)}
                        />
                    </MediaCard>
                ))}
            </InlineGrid>
        </Page>
    );
}
