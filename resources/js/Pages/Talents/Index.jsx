import {
    Page,
    MediaCard,
    VideoThumbnail,
    InlineGrid,
    Grid,
} from "@shopify/polaris";
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
            <Grid>
                {talents.map((talent, index) => (
                    <Grid.Cell
                        columnSpan={{ xs: 3, sm: 3, md: 3, lg: 3, xl: 3 }}
                    >
                        <MediaCard
                            key={index}
                            portrait
                            title={talent.name}
                            description={talent.summary}
                        >
                            <VideoThumbnail
                                thumbnailUrl={talent.thumbnail}
                                onClick={() =>
                                    navigate(`/talents/${talent.id}`)
                                }
                            />
                        </MediaCard>
                    </Grid.Cell>
                ))}
            </Grid>
        </Page>
    );
}
