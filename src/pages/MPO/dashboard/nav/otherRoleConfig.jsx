import SvgColor from '@/components/svg-color/SvgColor';
import { Icon } from '@iconify/react';

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const OtherRoleConfig = [
    {
        title: 'TourPlan',
        path: 'admin/tourplan',
        icon: <Icon icon="icon-park-solid:plan" style={{ fontSize: '20px' }} />,
    },
    {
        title: 'DCR',
        path: 'admin/dcr',
        icon: <Icon icon="material-symbols:data-table-outline" style={{ fontSize: '20px' }} />,
    },
    {
        title: 'Missed Call',
        path: 'admin/missedcalls',
        icon: <Icon icon="heroicons-solid:phone-missed-call" style={{ fontSize: '20px' }} />,
    },
    {
        title: 'My Executives',
        path: 'admin/my/executives',
        icon: <Icon icon="ph:user-light" style={{ fontSize: '20px' }} />,
    },
    {
        title: 'My Executives Tour Plan',
        path: 'admin/my/executives/tp',
        icon: <Icon icon="icon-park-solid:plan" style={{ fontSize: '20px' }} />,
    },
    {
        title: 'My Executives DCR',
        path: 'admin/my/executives/dcr',
        icon: <Icon icon="material-symbols:data-table-outline" style={{ fontSize: '20px' }} />,
    },
    {
        title: 'Application',
        path: 'admin/application',
        icon: <Icon icon="mdi:application-edit-outline" style={{ fontSize: '20px' }} />,
    },
    {
        title: 'Target',
        path: 'admin/target',
        icon: <Icon icon="tabler:target-arrow" style={{ fontSize: '20px' }} />,
    },
    {
        title: 'Allowances',
        path: 'admin/travelallowances',
        icon: <Icon icon="tabler:map-pin-dollar" style={{ fontSize: '20px' }} />,
    },
    {
        title: 'Analytics',
        path: 'admin/analytics',
        icon: <Icon icon="tdesign:chart-analytics" style={{ fontSize: '20px' }} />,
    },
];

export default OtherRoleConfig;
