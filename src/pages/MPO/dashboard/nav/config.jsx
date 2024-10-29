// component
import SvgColor from '@/components/svg-color/SvgColor';
import { Icon } from '@iconify/react';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/admin',
    icon: <Icon icon="carbon:text-link-analysis" style={{ fontSize: '20px' }} />,
  },
  {
    title: 'user',
    path: 'admin/listofuser',
    icon: <Icon icon="clarity:user-solid" style={{ fontSize: '20px' }} />,
  },

  {
    title: 'attendance',
    path: 'admin/user/attendance',
    icon: <Icon icon="material-symbols:fact-check-outline" style={{ fontSize: '20px' }} />,
  },
  {
    title: 'company',
    icon: <Icon icon="vaadin:office" style={{ fontSize: '20px' }} />,
    children: [
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
        title: 'Product',
        path: 'admin/listofproduct',
        icon: <Icon icon="icon-park-solid:medicine-bottle" style={{ fontSize: '20px' }} />,
      },
      {
        title: 'Doctor Call Folder',
        path: 'admin/doctorcallfolder',
        icon: <Icon icon="lucide:image" style={{ fontSize: '20px' }} />,
      },
    ],
  },
  //! MPO/ Other roles 
  {
    title: 'MPO/Other Roles',
    icon: <Icon icon="heroicons:users-solid" style={{ fontSize: '20px' }} />,
    children: [
      {
        title: 'TourPlan',
        path: 'admin/all/user/tourplan',
        icon: <Icon icon="icon-park-solid:plan" style={{ fontSize: '20px' }} />,
      },
      {
        title: 'DCR',
        path: 'admin/all/user/dcr',
        icon: <Icon icon="material-symbols:data-table-outline" style={{ fontSize: '20px' }} />,
      },
      {
        title: 'Missed Call',
        path: 'admin/missedcalls',
        icon: <Icon icon="heroicons-solid:phone-missed-call" style={{ fontSize: '20px' }} />,
      },
      {
        title: 'MPO Areas',
        path: 'admin/mpoareas',
        icon: <Icon icon="mdi:location" style={{ fontSize: '20px' }} />,
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
        title: 'Uploads',
        path: 'admin/upload',
        icon: <Icon icon="ph:upload-bold" style={{ fontSize: '20px' }} />,
      },
      {
        title: 'Leaves',
        path: 'admin/leave',
        icon: <Icon icon="fluent-mdl2:leave-user" style={{ fontSize: '20px' }} />,
      },
    ],
  },
  //! Sales 
  {
    title: 'Sales',
    icon: <Icon icon="bx:dollar" style={{ fontSize: '20px' }} />,
    children: [
      {
        title: 'Sales',
        path: 'admin/sales',
        icon: <Icon icon="bx:dollar" style={{ fontSize: '20px' }} />,
      },
      // {
      //   title: 'Primary Sales',
      //   path: 'admin/primarysales',
      //   icon: <Icon icon="bx:dollar" style={{ fontSize: '20px' }} />,
      // },
      {
        title: 'Secondary Sales',
        path: 'admin/secondarysales',
        icon: <Icon icon="bx:dollar" style={{ fontSize: '20px' }} />,
      },
    ]
  },
  {
    title: 'Ordered Products',
    path: 'admin/ordered-product',
    icon: <Icon icon="fa6-solid:truck-medical" style={{ fontSize: '20px' }} />,
  },
  {
    title: 'Organization Charts',
    path: 'admin/organization',
    icon: <Icon icon="ri:organization-chart" style={{ fontSize: '20px' }} />,
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
  {
    title: 'Settings',
    path: 'settings/admin/companyareas',
    icon: <Icon icon="mdi:cog" style={{ fontSize: '20px' }} />,
  },
];

export default navConfig;
