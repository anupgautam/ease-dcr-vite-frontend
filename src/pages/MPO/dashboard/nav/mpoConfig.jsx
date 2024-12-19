import SvgColor from '@/components/svg-color/SvgColor';
import { Icon } from '@iconify/react';

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const MpoNavConfig = [
    {
        title: 'Doctor',
        path: 'admin/listofdoctor',
        icon: <Icon icon="fa6-solid:user-doctor" style={{ fontSize: '20px' }} />,
    },
    {
        title: 'Chemist',
        path: 'admin/listofchemist',
        icon: <Icon icon="game-icons:medicines" style={{ fontSize: '20px' }} />,
    },
    {
        title: 'Stockist',
        path: 'admin/listofstockist',
        icon: <Icon icon="fa6-solid:suitcase-medical" style={{ fontSize: '20px' }} />,
    },
    {
        title: 'product',
        path: 'admin/listofproduct',
        icon: <Icon icon="icon-park-solid:medicine-bottle" style={{ fontSize: '20px' }} />,
    },
    {
        title: 'TourPlan',
        path: 'admin/tourplan',
        icon: <Icon icon="icon-park-solid:plan" style={{ fontSize: '20px' }} />,
    },
    {
        title: 'Missed Call',
        path: 'admin/missedcalls',
        icon: <Icon icon="heroicons-solid:phone-missed-call" style={{ fontSize: '20px' }} />,
    },
    {
        title: 'DCR',
        path: 'admin/dcr',
        icon: <Icon icon="material-symbols:data-table-outline" style={{ fontSize: '20px' }} />,
    },
    {
        title: 'My Areas',
        path: 'admin/mpoareas',
        icon: <Icon icon="mdi:location" style={{ fontSize: '20px' }} />,
    },
    {
        title: 'Uploads',
        path: 'admin/upload',
        icon: <Icon icon="ph:upload-bold" style={{ fontSize: '20px' }} />,
    },
    {
        title: 'Target',
        path: 'admin/target',
        icon: <Icon icon="tabler:target-arrow" style={{ fontSize: '20px' }} />,
    },
    {
        title: 'Application',
        path: 'admin/application',
        icon: <Icon icon="mdi:application-edit-outline" style={{ fontSize: '20px' }} />,
    },
    {
        title: 'Doctor Events',
        path: 'admin/doctorevent',
        icon: <Icon icon="simple-line-icons:event" style={{ fontSize: '20px' }} />,
    },
    {
        title: 'Expenses',
        path: 'admin/travelallowances',
        icon: <Icon icon="tabler:map-pin-dollar" style={{ fontSize: '20px' }} />,
    },
];

export default MpoNavConfig;
