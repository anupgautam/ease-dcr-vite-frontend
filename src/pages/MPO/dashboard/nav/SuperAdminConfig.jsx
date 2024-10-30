import SvgColor from '@/components/svg-color/SvgColor';
import { Icon } from '@iconify/react';

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const SuperAdminConfig = [
    {
        title: 'Company',
        path: 'superadmin/company',
        icon: <Icon icon="mdi:company" style={{ fontSize: '20px' }} />,
    },
    {
        title: 'Roles',
        path: 'superadmin/roles',
        icon: <Icon icon="heroicons:users-solid" style={{ fontSize: '20px' }} />,
    },
    {
        title: 'Company Roles',
        path: 'superadmin/companyroles',
        icon: <Icon icon="clarity:administrator-solid" style={{ fontSize: '20px' }} />,
    },
    {
        title: 'Company Users',
        path: 'superadmin/companyusers',
        icon: <Icon icon="mdi:user" style={{ fontSize: '20px' }} />,
    },

];

export default SuperAdminConfig;
