import "@shopify/polaris/build/esm/styles.css";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Button } from "@shopify/polaris";
import { BrowserRouter } from "react-router-dom";

export default function Dashboard() {
    return (
        <BrowserRouter basename="/dashboard">
            <AuthenticatedLayout
                header={
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Dashboard
                    </h2>
                }
            >
                <Button>sdf</Button>
            </AuthenticatedLayout>
        </BrowserRouter>
    );
}
