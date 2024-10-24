import { EmptyState, Page } from "@shopify/polaris";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <Page>
            <EmptyState
                heading="Page not found"
                action={{ content: "Go back", onAction: () => navigate("/") }}
                image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
            >
                <p>The page you're looking for couldn't be found.</p>
            </EmptyState>
        </Page>
    );
}
