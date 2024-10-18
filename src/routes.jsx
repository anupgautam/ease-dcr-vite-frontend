import { useRoutes } from 'react-router-dom';

import Login from './pages/Common/LoginComponent/LoginPage';
import MPODashboardLayout from './pages/MPO/dashboard/MPODashboardLayout';
import MPOSettingsLayout from './pages/MPO/dashboard/MPOSettingsLayout';
import DashboardAppPage from './pages/MPO/dashboard/DashboardAppPage';
import ListofChemistController from './pages/MPO/Chemist/ListOfChemistController';
import ListofDoctorController from './pages/MPO/Doctor/ListOfDoctorController';
import ListofStockistController from './pages/MPO/Stockist/ListOfStockistController';
import ListofUserController from './pages/MPO/User/ListOfUserController';
import ListofProductController from './pages/MPO/Product/ListOfProductController';
import ListofApplicationController from './pages/MPO/Application/ListofApplicationController';
import Page404 from './pages/Common/Page404';
import Authentication from './routing/Authentication';
import TargetController from './pages/MPO/Target/TargetController';
import ListOfExpensesController from './pages/MPO/Expenses/ListOfExpensesContoller';
import ListOfTourPlanController from './pages/MPO/TourPlan/ListOfTourPlanController';
import ChatController from './pages/MPO/Chat/ChatController';
import ListOfDCRController from './pages/MPO/DCR/ListofDCRController';
import ListOfUploadController from './pages/MPO/Upload/ListOfUploadController';
import ListOfCompanyAreaController from './pages/MPO/CompanyAreas/ListOfCompanyAreaController';
import ListOfDivisionController from './pages/MPO/Division/ListOfDivisionController';
import StructureController from './pages/MPO/OrganizationalStructure/structureController';
import HolidayController from './pages/MPO/Holiday/HolidayController';
import CompanyAreaWiseExpensesController from './pages/MPO/Daily Allowances/ListOfCompanyAreaWiseExpensesController';
import ListOfOrderedProductController from './pages/MPO/OrderedProduct/ListOfOrderedProduct';
import NotificationController from './pages/MPO/Notification/NotificationController';
import ForgotPassword from './pages/Common/ForgotPassword';
import NewPassword from './pages/Common/NewPassword';
import ListofLeaveUserController from './pages/MPO/Leaves/ListofLeaveUserController';
import ListOfSalesController from './pages/MPO/Sales/ListOfSalesController';
import UploadsDetail from './sections/@dashboard/uploads/UploadsDetail';
import ListOfRewardsController from './pages/MPO/Rewards/ListOfRewardsController';
import ListOfCompanyRolesController from './pages/MPO/CompanyRoles/ListOfCompanyRolesController';
import LandingController from './pages/Common/Landing/LandingController';
import OTP from './pages/Common/OTP';
import ChangePassword from './pages/Common/ChangePassword';
import Profile from './pages/Common/Profile/Profile';
import ListOfMissedCallsController from './pages/MPO/MissedCalls/ListOfMissedCallsController';
import ListOfPrimarySalesController from './pages/MPO/Sales/PrimarySales/ListOfPrimarySalesController';
import ListOfSecondarySalesController from './pages/MPO/Sales/SecondarySales/ListOfSecondarySalesController';
import ListOfCollectionsController from './pages/MPO/Collections/ListOfCollectionsController';
import ListofDoctorEventsController from './pages/MPO/DoctorEvents/ListofDoctorEventsController';
import ListOfDoctorSpecialization from './pages/MPO/Category/Doctor/ListOfDoctorSpecialization';
import ListOfTravelAllowancesController from './pages/MPO/Travel Allowances/ListOfTravelAllowancesController';
import ListofLockedUserController from './pages/MPO/dashboard/lockeduser/listOfLockedUserController';
import ListOfMPOAreasController from './pages/MPO/MPOAreas/ListOfMPOAreasController';
import AddDcrForDoctor from './pages/MPO/DCR/addDcrForDoctor';
import AddDCRforChemist from './pages/MPO/DCR/addDcrForChemist';
import AddDCRForStockist from './pages/MPO/DCR/addDcrForStockist';
import MyExecutives from './pages/MPO/dashboard/myExecutives/myExecutives';
import MyExecutiveTp from './pages/MPO/dashboard/myExecutivesTp/myExecutivesTp';
import MyExecutivesDcr from './pages/MPO/dashboard/myExecutivesDcr/myExecutivesDcr';
import ListofAttendance from './pages/attendance/listofAttendance';
import AllUserTp from './pages/MPO/TourPlan/allUserTp';
import AllUserDcr from './pages/MPO/DCR/allUserDcr';
import AddMutipleDoctor from './pages/MPO/Doctor/addMutipleDoctor';
import AddMultipleChemist from './pages/MPO/Chemist/addMultipleChemist';
import AddMultipleStockist from './pages/MPO/Stockist/addMultipleStockist';
import AddMultipleProduct from './pages/MPO/Product/addMultipleProduct';
import AddMultipleMpoArea from './pages/MPO/MPOAreas/addMultipleMpoArea';
import DcrListData from './pages/MPO/DCR/dcrListData';
import HolidayAreaController from './pages/MPO/HolidayArea/HolidayAreaController';
import ListOfMpoController from './pages/MPO/DoctorEvents/ListOfMpoController';
import ListOfTourPlanLock from './pages/MPO/TP_Lock/ListOfTourPlanLock';
import NewLogin from './pages/Common/LoginComponent/NewLogin';
import Attendance from './pages/attendance/Attendance';
import DCRDetail from './pages/MPO/DCR/DCRDetail';
import DCRChemistDetail from './pages/MPO/DCR/DCRChemistDetail';
import DCRStockistDetail from './pages/MPO/DCR/DCRStockistDetail';
import DCRHODetail from './pages/MPO/DCR/DCRHODetail';
import AddMultipleUser from './pages/MPO/User/addMultipleUser';
import FilterTravelAllowances from './pages/MPO/Travel Allowances/FilterTravelAllowances';
import ListOfCompanyController from './pages/MPO/Company/ListOfCompanyController';
import ListOfCompanyUsersController from './pages/MPO/CompanyUsers/ListOfCompanyUsersController';

export default function Router() {
  const routes = useRoutes([
    {
      path: '/',
      element: <LandingController />,
    },
    {
      path: '/login',
      // element: <Login />,
      element: <NewLogin />,
    },
    {
      path: '/forgetpassword',
      element: <ForgotPassword />,
    },
    {
      path: '/otp',
      element: <OTP />,
    },
    {
      path: '/newpassword',
      element: <NewPassword />,
    },
    {
      path: '/uploadnewtab/:id',
      element: <UploadsDetail />,
    },
    {
      path: '/superadmin/company',
      element: <ListOfCompanyController />,
    },
    {
      path: '/superadmin/companyroles',
      element: <ListOfCompanyRolesController />,
    },
    {
      path: '/superadmin/companyusers',
      element: <ListOfCompanyUsersController />,
    },
    {
      path: '/dashboard',
      element: <Authentication component={MPODashboardLayout} allowRoles={['admin', 'MPO', 'other-roles']} />,
      children: [
        {
          path: 'admin', element: <Authentication component={DashboardAppPage} allowRoles={['admin']} />
        },
        {
          path: 'admin/listofuser',
          element: <Authentication component={ListofUserController} allowRoles={['admin']} />,
        },
        {
          path: 'admin/add/multiple/user',
          element: <Authentication component={AddMultipleUser} allowRoles={['admin']} />,
        },
        // //!  Company
        {
          path: 'admin/listofdoctor',
          element: <Authentication component={ListofDoctorController} allowRoles={['admin', 'MPO']} />,
        },
        {
          path: 'admin/add/mutiple/doctor',
          element: <Authentication component={AddMutipleDoctor} allowRoles={['admin', 'MPO']} />,
        },
        {
          path: 'admin/listofchemist',
          element: <Authentication component={ListofChemistController} allowRoles={['admin', 'MPO', 'ASM']} />,
        },
        {
          path: 'admin/add/mutiple/chemist',
          element: <Authentication component={AddMultipleChemist} allowRoles={['admin', 'MPO', 'ASM']} />,
        },
        {
          path: 'admin/listofstockist',
          element: <Authentication component={ListofStockistController} allowRoles={['admin', 'MPO', 'ASM']} />,
        },
        {
          path: 'admin/add/mutiple/product',
          element: <Authentication component={AddMultipleProduct} allowRoles={['admin', 'MPO']} />,
        },
        {
          path: 'admin/add/mutiple/mpo/area',
          element: <Authentication component={AddMultipleMpoArea} allowRoles={['admin', 'MPO']} />,
        },
        {
          path: 'admin/add/mutiple/stockist',
          element: <Authentication component={AddMultipleStockist} allowRoles={['admin', 'MPO']} />,
        },
        {
          path: 'admin/my/executives',
          element: <Authentication component={MyExecutives} allowRoles={['other-roles']} />,
        },
        {
          path: 'admin/my/executives/tp',
          element: <Authentication component={MyExecutiveTp} allowRoles={['other-roles']} />,
        },
        {
          path: 'admin/my/executives/dcr',
          element: <Authentication component={MyExecutivesDcr} allowRoles={['other-roles']} />,
        },
        {
          path: 'admin/listofproduct',
          element: <Authentication component={ListofProductController} allowRoles={['admin', 'MPO']} />,
        },
        {
          path: 'admin/tourplan',
          element: <Authentication component={ListOfTourPlanController} allowRoles={['admin', 'MPO', 'other-roles']} />,
        },
        {
          path: 'admin/all/user/tourplan',
          element: <Authentication component={AllUserTp} allowRoles={['admin']} />,
        },
        {
          path: 'admin/all/user/dcrdoctordetail',
          element: <Authentication component={DCRDetail} allowRoles={['admin', 'MPO', 'other-roles']} />,
        },
        {
          path: 'admin/all/user/dcrchemistdetail',
          element: <Authentication component={DCRChemistDetail} allowRoles={['admin', 'MPO', 'other-roles']} />,
        },
        {
          path: 'admin/all/user/dcrstockistdetail',
          element: <Authentication component={DCRStockistDetail} allowRoles={['admin', 'MPO', 'other-roles']} />,
        },
        {
          path: 'admin/all/user/dcrhodetail',
          element: <Authentication component={DCRHODetail} allowRoles={['admin', 'MPO', 'other-roles']} />,
        },
        {
          path: 'admin/all/user/dcr',
          element: <Authentication component={AllUserDcr} allowRoles={['admin', 'MPO', 'other-roles']} />,
        },
        {
          path: 'admin/user/wise/dcr',
          element: <Authentication component={DcrListData} allowRoles={['admin', 'other-roles']} />,
        },
        {
          path: 'admin/dcr',
          element: <Authentication component={ListOfDCRController} allowRoles={['admin', 'MPO', , 'other-roles']} />,
        },
        {
          path: 'admin/missedcalls',
          element: <Authentication component={ListOfMissedCallsController} allowRoles={['admin']} />,
        },
        {
          path: 'admin/target',
          element: <Authentication component={TargetController} allowRoles={['admin', 'MPO', 'other-roles']} />,
        },
        {
          path: 'admin/application',
          element: <Authentication component={ListofApplicationController} allowRoles={['admin', 'MPO', 'other-roles']} />,
        },
        {
          path: 'admin/travelallowances',
          element: <Authentication component={ListOfTravelAllowancesController} allowRoles={['MPO', 'other-roles', 'admin']} />,
        },
        {
          path: 'admin/upload',
          element: <Authentication component={ListOfUploadController} allowRoles={['admin', 'MPO']} />,
        },
        {
          path: 'admin/mpoareas',
          element: <Authentication component={ListOfMPOAreasController} allowRoles={['admin', 'MPO']} />,
        },

        //! Sales
        {
          path: 'admin/sales',
          element: <Authentication component={ListOfSalesController} allowRoles={['admin']} />,
        },
        {
          path: 'admin/primarysales',
          element: <Authentication component={ListOfPrimarySalesController} allowRoles={['admin']} />,
        },

        {
          path: 'admin/secondarysales',
          element: <Authentication component={ListOfSecondarySalesController} allowRoles={['admin']} />,
        },

        //! Others 
        {
          path: 'admin/collections',
          element: <Authentication component={ListOfCollectionsController} allowRoles={['admin']} />,
        },
        {
          path: 'admin/ordered-product',
          element: <Authentication component={ListOfOrderedProductController} allowRoles={['admin']} />,
        },
        {
          path: 'admin/organization',
          element: <Authentication component={StructureController} allowRoles={['admin']} />,
        },
        {
          path: 'admin/expenses',
          element: <Authentication component={ListOfExpensesController} allowRoles={['admin']} />,
        },
        {
          path: 'admin/expenses/user',
          element: <Authentication component={FilterTravelAllowances} allowRoles={['admin']} />,
        },
        {
          path: 'admin/leave',
          element: <Authentication component={ListofLeaveUserController} allowRoles={['admin']} />,
        },
        {
          path: 'admin/chat',
          element: <Authentication component={ChatController} allowRoles={['admin']} />,
        },
        {
          path: 'admin/notification',
          element: <Authentication component={NotificationController} allowRoles={['admin', 'MPO', 'other-roles']} />,
        },
        {
          path: 'admin/changepassword',
          element: <Authentication component={ChangePassword} allowRoles={['admin', 'MPO', 'other-roles']} />,
        },
        {
          path: 'admin/user/attendance',
          // element: <Authentication component={ListofAttendance} allowRoles={['admin']} />,
          element: <Authentication component={Attendance} allowRoles={['admin']} />,
        },
        {
          path: 'admin/doctorevent',
          element: <Authentication component={ListOfMpoController} allowRoles={['admin', "MPO"]} />,
        },
        {
          path: 'admin/mpo/doctorevents',
          element: <Authentication component={ListofDoctorEventsController} allowRoles={['admin', "MPO"]} />,
        },
        {
          path: 'admin/locked/user',
          element: <Authentication component={ListofLockedUserController} allowRoles={['admin']} />,
        },
        {
          path: 'admin/dcr/for/doctor',
          element: <Authentication component={AddDcrForDoctor} allowRoles={['MPO']} />,
        },
        {
          path: 'admin/dcr/for/chemist',
          element: <Authentication component={AddDCRforChemist} allowRoles={['MPO']} />,
        },
        {
          path: 'admin/dcr/for/stockist',
          element: <Authentication component={AddDCRForStockist} allowRoles={['MPO']} />,
        },
        {
          path: 'admin/profile',
          element: <Profile />,
        },
      ],
    },

    // //!Settings 
    {
      path: '/dashboard/settings',
      element: <Authentication component={MPOSettingsLayout} allowRoles={['admin']} />,
      // element: <MPOSettingsLayout />,
      children: [
        // {
        //   path: 'admin/chemistcategory',
        //   element: <Authentication component={ListOfChemistCategory} allowRoles={['mpo']} />,
        // },
        {
          path: 'admin/companyareas',
          element: <Authentication component={ListOfCompanyAreaController} allowRoles={['admin']} />,
        },
        {
          path: 'admin/companyareawiseexpense',
          element: <Authentication component={CompanyAreaWiseExpensesController} allowRoles={['admin']} />,
        },
        {
          path: 'admin/doctorspecialization',
          element: <Authentication component={ListOfDoctorSpecialization} allowRoles={['admin']} />,
        },
        {
          path: 'admin/divisions',
          element: <Authentication component={ListOfDivisionController} allowRoles={['admin']} />,
        },
        {
          path: 'admin/roles',
          element: <Authentication component={ListOfCompanyRolesController} allowRoles={['admin']} />,
        },
        {
          path: 'admin/holiday',
          element: <Authentication component={HolidayController} allowRoles={['admin']} />,
        },
        {
          path: 'admin/holidayarea',
          element: <Authentication component={HolidayAreaController} allowRoles={['admin']} />,
        },
        {
          path: 'admin/rewards',
          element: <Authentication component={ListOfRewardsController} allowRoles={['admin']} />,
        },
        {
          path: 'admin/dcrlockdays',
          element: <Authentication component={ListOfTourPlanLock} allowRoles={['admin']} />,
        },

      ]
    },

    {
      path: '*',
      element: <Authentication component={Page404} />,
    },
  ]);

  return routes;
}
