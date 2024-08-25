import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// ! Common Pages  
import StartPage from "@/pages/Common/StartPage";
import Register from "@/pages/Common/Register";
import Login from "@/pages/Common/LoginComponent/LoginPage";
import Page404 from "@/pages/Common/Page404";

// ! MPO pages
import ListOfChemistController from '../pages/MPO/Chemist/ListOfChemistController';

// ! ASM pages
import ASMDashboard from '@/pages/ASM/dashboard';
import RSMDashboard from '@/pages/RSM/dashboard';
import MPODashboard from '@/pages/MPO/dashboard'

// import DashboardHome from "../containers/dashboard/pages/homeComponent/home";
// import MedicineListController from "../containers/dashboard/pages/productComponent/medicineLists/medicineListController";
// import ContactUsController from "../containers/dashboard/pages/productComponent/contactus/contactusController";
// import ListofUserController from "../containers/dashboard/pages/loginComponent/listofusers/listofUserController";
// import StockistListController from "../containers/dashboard/pages/stockistComponent/StockistlistController";
// import HelpCenterController from "../containers/dashboard/pages/productComponent/helpcenter/HelpCenterController";
// import ListofDoctorController from "../containers/dashboard/pages/doctorComponent/listofdoctorController";
// import ListofChemistController from "../containers/dashboard/pages/chemistComponent/listofchemistController";
// import NoticeController from "../containers/dashboard/pages/noticeComponent/noticeController";
// import EditMedicine from "../containers/dashboard/pages/productComponent/medicineLists/EditMedicine";
// import EditStockist from "../containers/dashboard/pages/stockistComponent/EditStockist";
// import EditDoctor from "../containers/dashboard/pages/doctorComponent/EditDoctor";
// import EditChemist from "../containers/dashboard/pages/chemistComponent/EditChemist";
// import ListofDoctorDCRController from "../containers/MPODashboard/DCRs/DoctorDCR/doctorDCRListController";
// import ListofChemistDCRController from "../containers/MPODashboard/DCRs/ChemistDCR/chemistDCRListController";
// import ListofStockistDCRController from "../containers/MPODashboard/DCRs/StockistDCR/stockistDCRListController";
// import ProductPieChart from "../containers/dashboard/ProductPieChart";
// import EditChemistDCR from "../containers/MPODashboard/DCRs/ChemistDCR/EditChemistDCR";
// import Calendar from "../containers/dashboard/pages/CalendarComponent/Calendar";
// import TrialUserList from "../containers/dashboard/pages/TrialUserListComponent/TrialUserList";
// import EditDoctorDCR from "../containers/MPODashboard/DCRs/DoctorDCR/EditDoctorDCR";
// import EditStockistDCR from "../containers/MPODashboard/DCRs/StockistDCR/EditStockistDCR";
// import EditTrialUsers from "../containers/dashboard/pages/TrialUserListComponent/EditTrailUsers";
// import EditUserWala from "../containers/dashboard/pages/loginComponent/listofusers/EditUserWala";
// import TourPlanList from "../containers/MPODashboard/DCRs/TourPlan/TourPlanList";
// import EditDCR from "../../@/containers/MPODashboard/DCRs/DoctorDCR/EditDoctorDCR/EditDCR";
// import AddDCR from "../../@/containers/MPODashboard/DCRs/DoctorDCR/AddDoctorDCR/AddDCRwala";
// import RequireAuth from "../../@/containers/RequireAuth";
// import Authentication from "./Authentication";
// import ExpensesPage from "../containers/dashboard/pages/expenses/expenses";

// import EmployeeForm from "../reusable/EmployeeForm";
// import Sidenav from "../containers/dashboard/component/Sidenav/Sidenav";
// import ASMDashboard from "../containers/dashboard/component/Sidenav/ASMDashboard";
// import ASMDashboardLayout from "../containers/dashboard/component/Layout/dashboard/ASMDashboardLayout";
// import WorkingASMDays from "../containers/dashboard/pages/ASM/WorkingASMDays";

// import RSMDashboard from "../containers/dashboard/component/Sidenav/RSMDashboard";

const Routing = () => {

  const [isAuth, setIsAuth] = useState(false);
  const TOKEN_KEY = { access, refresh, email, userrole }

  useEffect(() => {
    if (TOKEN_KEY['access'] == null && TOKEN_KEY['refresh'] == null && TOKEN_KEY['email'] == null) {
      setIsAuth(false);
    }
    else {
      setIsAuth(true);
    }
  }, [])



  return (
    <Routes>

      {/*//! Public Routes  */}
      <Route path="/" element={<StartPage />} />
      <>
        <Route path="/login" exact element={<Login />} />
        <Route path="/register" exact element={<Register />} />
        <Route path="/dashboard/mpo" exact element={<MPODashboard />} />
        <Route path="/dashboard/asm" exact element={<ASMDashboard />} />
        <Route path="/dashboard/rsm" exact element={<RSMDashboard />} />
        <Route
        path="/dashboard/listofchemist"
        element={<ListOfChemistController />}
      />
      </>

      {/*//! Protected Routes for MPO Only  */}

      {/* <Route path="/dashboard/mpo" exact element={<Authentication component={Sidenav} allowRoles={['mpo']} />}></Route>

      <Route path="/dashboard/asm" exact element={<Authentication component={ASMDashboardLayout} allowRoles={['asm']} />}></Route>

      <Route path="/dashboard/rsm" exact element={<Authentication component={RSMDashboard} allowRoles={['rsm']} />}></Route>


      <Route
        path="/dashboard/product"
        element={<MedicineListController />}
      />
      <Route path="/dashboard/productlist/:id" element={<EditMedicine />} />
      <Route path="/dashboard/userlist" element={<ListofUserController />} />
      <Route path="/dashboard/userlistwala/:id" element={<EditUserWala />} />
      <Route path="/dashboard/calendar" element={<Calendar />} />
      <Route
        path="/dashboard/listofstockist"
        element={<StockistListController />}
      />
      <Route path="/dashboard/stockistlist/:id" element={<EditStockist />} />

      <Route
        path="/dashboard/listofdoctor"
        element={<ListofDoctorController />}
      />
      <Route path="/dashboard/listofdoctor/:id" element={<EditDoctor />} />

      <Route
        path="/dashboard/listofchemist"
        element={<ListofChemistController />}
      />
      <Route path="/dashboard/listofchemist/:id" element={<EditChemist />} />

      <Route path="/dashboard/contactus" element={<ContactUsController />} />
      <Route path="/dashboard/expenses" element={<ExpensesPage />} />
      <Route
        path="/dashboard/helpcenter"
        element={<HelpCenterController />}
      />
      <Route path="/dashboard/notices" element={<NoticeController />} />

      <Route
        path="dashboard/mpo/listofdoctordcr"
        element={<ListofDoctorDCRController />}
      />
      <Route
        path="dashboard/mpo/listofdoctordcr/:id"
        element={<EditDoctorDCR />}
      />

      <Route
        path="dashboard/mpo/listofchemistdcr"
        element={<ListofChemistDCRController />}
      />
      <Route
        path="dashboard/mpo/listofchemistdcr/:id"
        element={<EditChemistDCR />}
      />

      <Route
        path="dashboard/mpo/listofstockistdcr"
        element={<ListofStockistDCRController />}
      />

      <Route
        path="dashboard/mpo/adddoctordcrwalaform"
        element={<AddDCR />}
      />

      <Route
        path="dashboard/mpo/adddoctordcrwalaform/:id"
        element={<EditDCR />}
      />

      <Route
        path="dashboard/mpo/listofstockistdcr/:id"
        element={<EditStockistDCR />}
      />

      <Route path="dashboard/asm/workingdays" exact element={<Authentication component={WorkingASMDays} allowRoles={['asm']} />}></Route>

      <Route path="productpiechart" element={<ProductPieChart />} />

      <Route path="dashboard/employeeservice" element={<EmployeeForm />} />

      <Route path="dashboard/mpo/tourplan" element={<TourPlanList />} /> */}


      {/* </Route> */}
      {/* <Route path="*" element={<Navigate to="/" />}></Route> */}
    </Routes>
  );
};

export default Routing;
