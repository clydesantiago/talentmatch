import {
    ActionList,
    AppProvider,
    LegacyCard,
    ContextualSaveBar,
    FormLayout,
    Frame,
    Layout,
    Loading,
    Modal,
    Navigation,
    SkeletonBodyText,
    SkeletonDisplayText,
    SkeletonPage,
    TextContainer,
    TextField,
    Toast,
    TopBar,
} from "@shopify/polaris";
import { Route, Routes, useNavigate } from "react-router-dom";
import Dashboard from "@/Pages/Dashboard";
import Projects from "@/Pages/Projects/Index";
import UpdateOrCreateProject from "@/Pages/Projects/UpdateOrCreate";
import Jobs from "@/Pages/Jobs/Index";
import UpdateOrCreateJob from "@/Pages/Jobs/UpdateOrCreate";
import Talents from "@/Pages/Talents/Index";
import UpdateOrCreateTalent from "@/Pages/Talents/UpdateOrCreate";
import NotFound from "@/Pages/NotFound";
import {
    BankIcon,
    AppsIcon,
    HomeIcon,
    PersonIcon,
    WorkIcon,
    ChatIcon,
} from "@shopify/polaris-icons";
import { useState, useCallback, useRef } from "react";

export default function FrameExample() {
    const navigate = useNavigate();

    const defaultState = useRef({
        emailFieldValue: "dharma@jadedpixel.com",
        nameFieldValue: "Jaded Pixel",
    });
    const skipToContentRef = useRef(null);

    const [toastActive, setToastActive] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    const [searchActive, setSearchActive] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [userMenuActive, setUserMenuActive] = useState(false);
    const [mobileNavigationActive, setMobileNavigationActive] = useState(false);
    const [modalActive, setModalActive] = useState(false);
    const [nameFieldValue, setNameFieldValue] = useState(
        defaultState.current.nameFieldValue
    );
    const [emailFieldValue, setEmailFieldValue] = useState(
        defaultState.current.emailFieldValue
    );
    const [storeName, setStoreName] = useState(
        defaultState.current.nameFieldValue
    );
    const [supportSubject, setSupportSubject] = useState("");
    const [supportMessage, setSupportMessage] = useState("");

    const handleSubjectChange = useCallback(
        (value) => setSupportSubject(value),
        []
    );
    const handleMessageChange = useCallback(
        (value) => setSupportMessage(value),
        []
    );
    const handleDiscard = useCallback(() => {
        setEmailFieldValue(defaultState.current.emailFieldValue);
        setNameFieldValue(defaultState.current.nameFieldValue);
        setIsDirty(false);
    }, []);
    const handleSave = useCallback(() => {
        defaultState.current.nameFieldValue = nameFieldValue;
        defaultState.current.emailFieldValue = emailFieldValue;

        setIsDirty(false);
        setToastActive(true);
        setStoreName(defaultState.current.nameFieldValue);
    }, [emailFieldValue, nameFieldValue]);

    const handleSearchResultsDismiss = useCallback(() => {
        setSearchActive(false);
        setSearchValue("");
    }, []);
    const handleSearchFieldChange = useCallback((value) => {
        setSearchValue(value);
        setSearchActive(value.length > 0);
    }, []);
    const toggleToastActive = useCallback(
        () => setToastActive((toastActive) => !toastActive),
        []
    );
    const toggleUserMenuActive = useCallback(
        () => setUserMenuActive((userMenuActive) => !userMenuActive),
        []
    );
    const toggleMobileNavigationActive = useCallback(
        () =>
            setMobileNavigationActive(
                (mobileNavigationActive) => !mobileNavigationActive
            ),
        []
    );
    const toggleIsLoading = useCallback(
        () => setIsLoading((isLoading) => !isLoading),
        []
    );
    const toggleModalActive = useCallback(
        () => setModalActive((modalActive) => !modalActive),
        []
    );

    const toastMarkup = toastActive ? (
        <Toast onDismiss={toggleToastActive} content="Changes saved" />
    ) : null;

    const userMenuActions = [
        {
            items: [{ content: "Community forums" }],
        },
    ];

    const contextualSaveBarMarkup = isDirty ? (
        <ContextualSaveBar
            message="Unsaved changes"
            saveAction={{
                onAction: handleSave,
            }}
            discardAction={{
                onAction: handleDiscard,
            }}
        />
    ) : null;

    const userMenuMarkup = (
        <TopBar.UserMenu
            actions={userMenuActions}
            name="Dharma"
            detail={storeName}
            initials="D"
            open={userMenuActive}
            onToggle={toggleUserMenuActive}
        />
    );

    const searchResultsMarkup = (
        <ActionList
            items={[
                { content: "Shopify help center" },
                { content: "Community forums" },
            ]}
        />
    );

    const searchFieldMarkup = (
        <TopBar.SearchField
            onChange={handleSearchFieldChange}
            value={searchValue}
            placeholder="Search"
        />
    );

    const topBarMarkup = (
        <TopBar
            showNavigationToggle
            userMenu={userMenuMarkup}
            searchResultsVisible={searchActive}
            searchField={searchFieldMarkup}
            searchResults={searchResultsMarkup}
            onSearchResultsDismiss={handleSearchResultsDismiss}
            onNavigationToggle={toggleMobileNavigationActive}
        />
    );

    const navigationMarkup = (
        <Navigation location="/">
            <Navigation.Section
                items={[
                    {
                        label: "Dashboard",
                        icon: HomeIcon,
                        onClick: () => navigate("/"),
                    },
                    {
                        label: "Projects",
                        icon: AppsIcon,
                        onClick: () => navigate("/projects"),
                    },
                    {
                        label: "Jobs",
                        icon: WorkIcon,
                        onClick: () => navigate("/jobs"),
                    },
                    {
                        label: "Talents",
                        icon: PersonIcon,
                        onClick: () => navigate("/talents"),
                    },
                    {
                        label: "Companies",
                        icon: BankIcon,
                        onClick: () => navigate("/projects"),
                    },
                ]}
                action={{
                    icon: ChatIcon,
                    accessibilityLabel: "Contact support",
                    onClick: toggleModalActive,
                }}
            />
        </Navigation>
    );

    const loadingMarkup = isLoading ? <Loading /> : null;

    const actualPageMarkup = (
        <Routes>
            <Route exact path="/" element={<Dashboard />} />
            <Route exact path="/projects" element={<Projects />} />
            <Route
                exact
                path="/projects/create"
                element={<UpdateOrCreateProject />}
            />
            <Route
                exact
                path="/projects/:id"
                element={<UpdateOrCreateProject />}
            />
            <Route exact path="/jobs" element={<Jobs />} />
            <Route exact path="/jobs/create" element={<UpdateOrCreateJob />} />
            <Route exact path="/jobs/:id" element={<UpdateOrCreateJob />} />
            <Route exact path="/talents" element={<Talents />} />
            <Route
                exact
                path="/talents/create"
                element={<UpdateOrCreateTalent />}
            />
            <Route
                exact
                path="/talents/:id"
                element={<UpdateOrCreateTalent />}
            />
            <Route exact path="*" element={<NotFound />} />
        </Routes>
    );

    const loadingPageMarkup = (
        <SkeletonPage>
            <Layout>
                <Layout.Section>
                    <LegacyCard sectioned>
                        <TextContainer>
                            <SkeletonDisplayText size="small" />
                            <SkeletonBodyText lines={9} />
                        </TextContainer>
                    </LegacyCard>
                </Layout.Section>
            </Layout>
        </SkeletonPage>
    );

    const pageMarkup = isLoading ? loadingPageMarkup : actualPageMarkup;

    const modalMarkup = (
        <Modal
            open={modalActive}
            onClose={toggleModalActive}
            title="Contact support"
            primaryAction={{
                content: "Send",
                onAction: toggleModalActive,
            }}
        >
            <Modal.Section>
                <FormLayout>
                    <TextField
                        label="Subject"
                        value={supportSubject}
                        onChange={handleSubjectChange}
                        autoComplete="off"
                    />
                    <TextField
                        label="Message"
                        value={supportMessage}
                        onChange={handleMessageChange}
                        autoComplete="off"
                        multiline
                    />
                </FormLayout>
            </Modal.Section>
        </Modal>
    );

    const logo = {
        width: 200,
        topBarSource:
            "https://admin.assets.codexapps.co/uploads/codexapps/remote-dev-logo-3-1729794273.png",
        contextualSaveBarSource:
            "https://admin.assets.codexapps.co/uploads/codexapps/remote-dev-logo-3-1729794273.png",
        accessibilityLabel: "Shopify",
    };

    return (
        <div style={{ height: "500px" }}>
            <AppProvider>
                <Frame
                    logo={logo}
                    topBar={topBarMarkup}
                    navigation={navigationMarkup}
                    showMobileNavigation={mobileNavigationActive}
                    onNavigationDismiss={toggleMobileNavigationActive}
                    skipToContentTarget={skipToContentRef}
                >
                    {contextualSaveBarMarkup}
                    {loadingMarkup}
                    {pageMarkup}
                    {toastMarkup}
                    {modalMarkup}
                </Frame>
            </AppProvider>
        </div>
    );
}
