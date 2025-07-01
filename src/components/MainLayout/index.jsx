import React, { useEffect, useState } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { AiOutlineDashboard } from "react-icons/ai";
import { RiImage2Line } from "react-icons/ri";
import { MdOutlineFeaturedPlayList } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Layout, Menu, Grid, theme } from "antd";



import logo from "../../assets/images/logo.png";
import smallLogo from "../../assets/images/logo.png";
import { useAuth } from "../../contexts/authContext";
import { api } from "../../utils/api";

const { Header, Sider, Content } = Layout;
const { useBreakpoint } = Grid;

const MainLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const screens = useBreakpoint();

    const { updateUser } = useAuth()

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setCollapsed(true);
            }
        };

        window.addEventListener("resize", handleResize);
        handleResize(); // Initial check
        return () => window.removeEventListener("resize", handleResize);
    }, []);


    const signOut = async () => {
        try {
            const res = await api.post("api/auth/logout")
            toast.success(res.data.message)
        } catch (err) {
            console.error("Failed to logout", err)
            toast.error("Failed to logout")
        }
    }

    const handleLogout = () => {
        signOut();
        updateUser(null)
        localStorage.removeItem('accessToken')

        toast.success("You are logged out");
        setTimeout(() => {
            navigate("/");
        }, 2000);
    };


    const handleMenuClick = ({ key }) => {
        navigate(key); // Navigate to the selected menu route
    };

    const {
        token: { colorBgContainer },
    } = theme.useToken();



    return (
        <>
            <Layout>
                <Sider
                    trigger={null}
                    collapsible
                    collapsed={collapsed}
                    className="sider sticky-top"
                    breakpoint="md"
                    collapsedWidth="80"

                    style={{ minHeight: "100vh", maxHeight: "auto", position: "sticky", top: "0" }}
                >
                    <div className="logo text-center py-3">
                        <img
                            src={collapsed ? smallLogo : logo}
                            alt="Logo"
                            className="logo-img"
                            style={{
                                width: collapsed ? "50px" : "90px",
                                transition: "width 0.3s",
                            }}
                        />
                    </div>
                    <Menu
                        theme="dark"
                        mode="inline"
                        defaultSelectedKeys={["/"]}
                        onClick={handleMenuClick}
                        items={[
                            {
                                key: "Services",
                                icon: <AiOutlineDashboard className="fs-4" />,
                                label: "Services",
                            },
                            {
                                key: "SubServices",
                                icon: <MdOutlineFeaturedPlayList className="fs-4" />,
                                label: "Sub Services",
                            },
                            {
                                key: "Gallery",
                                icon: <RiImage2Line className="fs-4" />,
                                label: "Gallery",
                            },
                            {
                                key: "Testimonials",
                                icon: <RiImage2Line className="fs-4" />,
                                label: "Testimonials",
                            },


                        ]}
                    />
                </Sider>

                <Layout className="site-layout">
                    <Header
                        className="sticky-top d-flex justify-content-between ps-1 pe-5 header"
                        style={{ color: "white", lineHeight: "10px" }}
                    >
                        {React.createElement(
                            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
                            {
                                className: "trigger",
                                onClick: () => setCollapsed(!collapsed),
                            }
                        )}

                        <div className="d-flex gap-4 align-items-center">


                            <div className="d-flex gap-3 align-items-center dropdown">
                                <div></div>
                                <div
                                    role="button"
                                    id="dropdownMenuLink"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    {!screens.xs && (
                                        <div className="d-flex flex-column">
                                            <h5 className="mb-0">Admin</h5>
                                            <span className="m-0">admin@artspire.com</span>
                                        </div>
                                    )}
                                </div>
                                <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                                    <li>
                                        <Link
                                            className="dropdown-item py-1 mb-1"
                                            style={{ height: "auto", lineHeight: "20px" }}
                                        >
                                            View Profile
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            className="dropdown-item py-1 mb-1"
                                            style={{ height: "auto", lineHeight: "20px" }}
                                            onClick={handleLogout}
                                        >
                                            Sign out
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </Header>

                    <Content
                        style={{
                            background: colorBgContainer,
                            overflowY: "auto",
                        }}
                    >
                        <ToastContainer
                            position="top-right"
                            autoClose={250}
                            hideProgressBar={false}
                            newestOnTop={true}
                            closeOnClick
                            rtl={false}
                            pauseOnFocusLoss
                            draggable
                            theme="light"
                        />
                        <Outlet />
                    </Content>
                </Layout>
            </Layout>
        </>
    );
};

export default MainLayout;
