import {
    LegacyFilters,
    LegacyCard,
    ResourceList,
    Avatar,
    ResourceItem,
    Text,
    Page,
    Badge,
    LegacyStack,
    Tag,
    Thumbnail,
} from "@shopify/polaris";
import { useState, useCallback, useEffect } from "react";
import axios from "@/Plugins/axios";
import { useNavigate } from "react-router-dom";
import { ImageIcon } from "@shopify/polaris-icons";

export default function ResourceListExample() {
    const navigate = useNavigate();

    const [queryValue, setQueryValue] = useState("");
    const [jobs, setJobs] = useState([]);

    const handleQueryValueChange = useCallback(
        (value) => setQueryValue(value),
        []
    );
    const handleQueryValueRemove = useCallback(
        () => setQueryValue(undefined),
        []
    );
    const handleClearAll = useCallback(() => {
        handleQueryValueRemove();
    }, [handleQueryValueRemove]);

    const fetchJobs = useCallback(() => {
        axios.get("/job-lists").then((response) => {
            setJobs(response.data);
        });
    }, [setJobs]);

    useEffect(() => {
        fetchJobs();
    }, [fetchJobs]);

    const filterControl = (
        <LegacyFilters
            queryPlaceholder="Search jobs"
            queryValue={queryValue}
            filters={[]}
            onQueryChange={handleQueryValueChange}
            onQueryClear={handleQueryValueRemove}
            onClearAll={handleClearAll}
        />
    );

    return (
        <Page
            title="Jobs"
            primaryAction={{
                content: "Create job",
                onAction: () => navigate("/jobs/create"),
            }}
        >
            <LegacyCard>
                <ResourceList
                    showHeader={false}
                    items={jobs}
                    renderItem={renderItem}
                    filterControl={filterControl}
                />
            </LegacyCard>
        </Page>
    );

    function renderItem(item) {
        const media = (
            <Thumbnail source={item.thumbnail || ImageIcon} alt={item.title} />
        );

        return (
            <ResourceItem
                id={item.id}
                media={media}
                persistActions
                onClick={() => navigate(`/jobs/${item.id}`)}
            >
                <LegacyStack vertical spacing="tight">
                    <Text variant="bodyMd" fontWeight="bold" as="h3">
                        {item.title}
                    </Text>
                    <LegacyStack spacing="tight">
                        <Tag>
                            {item.years_of_experience}+ years of experience
                        </Tag>
                        <Tag>
                            ${item.minimum_salary?.toLocaleString("en-US")} - $
                            {item.maximum_salary?.toLocaleString("en-US")}
                        </Tag>
                    </LegacyStack>
                </LegacyStack>
            </ResourceItem>
        );
    }
}
