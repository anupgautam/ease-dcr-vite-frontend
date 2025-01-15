import ReusablePrelineNav from "./ReusablePrelineNav";
import { Icon } from '@iconify/react';

const ReusableConfig = () => {
    const sidebarLinks = [
        {
            label: "Dashboard",
            path: "admin",
            icon: <Icon icon="carbon:text-link-analysis" style={{ fontSize: '20px' }} />
        },
        {
            label: "Users",
            path: "admin/listofuser",
            icon: <Icon icon="clarity:user-solid" style={{ fontSize: '20px' }} />,
        },
        {
            label: "Attendance",
            path: "admin/user/attendance",
            icon: <Icon icon="material-symbols:fact-check-outline" style={{ fontSize: '20px' }} />,
        },
        {
            label: "Company",
            path: null,
            icon: <Icon icon="vaadin:office" style={{ fontSize: '20px' }} />,
            children: [
                {
                    label: "Doctor",
                    path: "admin/listofdoctor",
                    icon:
                        <Icon icon="fa6-solid:user-doctor" style={{ fontSize: '20px' }} />
                },
                {
                    label: "Chemist",
                    path: "admin/listofchemist",
                    icon: <Icon icon="game-icons:medicines" style={{ fontSize: '20px' }} />,
                },
            ],
        },
    ];

    return <ReusablePrelineNav logoSrc="/assets/ease.png" links={sidebarLinks} />;
};

export default ReusableConfig;
