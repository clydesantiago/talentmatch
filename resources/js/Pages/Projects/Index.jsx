import {
    LegacyFilters,
    LegacyCard,
    ResourceList,
    Avatar,
    ResourceItem,
    Text,
    Page,
} from "@shopify/polaris";
import { useState, useCallback } from "react";
import { useNavigate } from "react-router";

export default function ResourceListExample() {
    const navigate = useNavigate();
    const [queryValue, setQueryValue] = useState(undefined);

    const handleQueryValueChange = useCallback(
        (value) => setQueryValue(value),
        []
    );
    const handleQueryValueRemove = useCallback(
        () => setQueryValue(undefined),
        []
    );

    const resourceName = {
        singular: "project",
        plural: "projects",
    };

    const items = [
        {
            id: "112",
            url: "#",
            name: "Mae Jemison",
            location: "Decatur, USA",
            latestOrderUrl: "orders/1456",
        },
        {
            id: "212",
            url: "#",
            name: "Ellen Ochoa",
            location: "Los Angeles, USA",
            latestOrderUrl: "orders/1457",
        },
    ];

    const filterControl = (
        <LegacyFilters
            queryPlaceholder="Search projects"
            queryValue={queryValue}
            filters={[]}
            onQueryChange={handleQueryValueChange}
            onQueryClear={handleQueryValueRemove}
        />
    );

    return (
        <Page
            title="Projects"
            primaryAction={{
                content: "Create a project",
                onAction: () => navigate("create"),
            }}
        >
            <LegacyCard>
                <ResourceList
                    showHeader={false}
                    resourceName={resourceName}
                    items={items}
                    renderItem={renderItem}
                    filterControl={filterControl}
                />
            </LegacyCard>
        </Page>
    );

    function renderItem(item) {
        const { id, url, name, location, latestOrderUrl } = item;
        const media = <Avatar customer size="md" name={name} />;
        const shortcutActions = latestOrderUrl
            ? [{ content: "View latest order", url: latestOrderUrl }]
            : undefined;
        return (
            <ResourceItem
                id={id}
                url={url}
                media={media}
                accessibilityLabel={`View details for ${name}`}
                shortcutActions={shortcutActions}
                persistActions
            >
                <Text variant="bodyMd" fontWeight="bold" as="h3">
                    {name}
                </Text>
                <div>{location}</div>
            </ResourceItem>
        );
    }

    function isEmpty(value) {
        if (Array.isArray(value)) {
            return value.length === 0;
        } else {
            return value === "" || value == null;
        }
    }
}
