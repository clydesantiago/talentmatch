import {
    LegacyFilters,
    LegacyCard,
    ResourceList,
    Avatar,
    ResourceItem,
    Text,
    Page,
} from "@shopify/polaris";
import { useState, useCallback, useEffect } from "react";
import axios from "@/Plugins/axios";
import { useNavigate } from "react-router-dom";

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
        axios.get("/jobs").then((response) => {
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
        const { id, url, title, role, latestOrderUrl } = item;
        const media = <Avatar customer size="md" name={title} />;
        const shortcutActions = latestOrderUrl
            ? [{ content: "View latest order", url: latestOrderUrl }]
            : undefined;
        return (
            <ResourceItem
                id={id}
                url={url}
                media={media}
                shortcutActions={shortcutActions}
                persistActions
            >
                <Text variant="bodyMd" fontWeight="bold" as="h3">
                    {title}
                </Text>
                <div>{role}</div>
            </ResourceItem>
        );
    }
}
