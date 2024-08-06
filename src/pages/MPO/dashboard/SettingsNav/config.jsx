import SvgColor from '@/components/svg-color/SvgColor';
import { Icon } from '@iconify/react';

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navsettingsConfig = [
  {
    title: 'Working Areas',
    path: 'admin/companyareas',
    icon: <Icon icon="bx:area" style={{ fontSize: '20px' }} />,
  },
  {
    title: 'Allowances',
    path: 'admin/travelallowances',
    icon: <Icon icon="tabler:map-pin-dollar" style={{ fontSize: '20px' }} />,
  },
  {
    title: 'Doctor Specialization',
    path: 'admin/doctorspecialization',
    icon: <Icon icon="medical-icon:i-imaging-root-category" style={{ fontSize: '20px' }} />,
  },
  {
    title: 'Divisions',
    path: 'admin/divisions',
    icon: <Icon icon="ps:facebook-places" style={{ fontSize: '20px' }} />,
  },
  {
    title: 'Roles',
    path: 'admin/roles',
    icon: <Icon icon="codicon:organization" style={{ fontSize: '20px' }} />,
  },
  {
    title: 'Holidays',
    path: 'admin/holiday',
    icon: <Icon icon="line-md:calendar" style={{ fontSize: '20px' }} />,
  },
  {
    title: 'Holidays Area',
    path: 'admin/holidayarea',
    icon: <Icon icon="line-md:calendar" style={{ fontSize: '20px' }} />,
  },
  {
    title: 'Rewards',
    path: 'admin/rewards',
    icon: <Icon icon="material-symbols:rewarded-ads" style={{ fontSize: '20px' }} />,
  },

  {
    title: 'back to dashboard',
    path: '/dashboard/admin',
    icon: <Icon icon="lucide:arrow-left" style={{ fontSize: '20px' }} />,
  },

];

export default navsettingsConfig;
