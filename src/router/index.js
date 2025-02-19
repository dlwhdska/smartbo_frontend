import { createRouter, createWebHistory } from "vue-router";

import Dashboard from "@/pages/dashboard/Dashboard.vue";
import Attendance from "@/pages/attendance/AttendanceList.vue";
import AddressList from "@/pages/address/AddressList.vue";
import CarList from "@/pages/car/CarList.vue";
import CarMyRentList from "@/pages/car/CarMyRentList.vue";
import CarManage from "@/pages/car/CarManage.vue";
import CarAllRentList from "@/pages/car/CarAllRentList.vue";
import Calendar from "@/pages/schedule/Calendar.vue";
import NoticeList from "@/pages/notice/NoticeList.vue";
import NoticeInfo from "@/pages/notice/NoticeInfo.vue";
import MeetingRoomList from "@/pages/meetingroom/MeetingRoomList.vue";
import ReservationModal from "@/pages/meetingroom/ReservationModal.vue";
import MeetingRoomResList from "@/pages/meetingroom/MeetingRoomResList.vue";
import MeetingRoomTimeline from "@/pages/meetingroom/FullCalendarTest.vue";
import StuffRequest from "@/pages/stuff/StuffRequest.vue";
import StuffManage from "@/pages/stuff/StuffManage.vue";
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/dashboard", component: Dashboard },
    { path: "/address/addresslist/", component: AddressList },
    { path: "/address/addresslist/:currentPage", component: AddressList },
    { path: "/carrent/carlist/", component: CarList },
    { path: "/carrent/carlist/:currentPage", component: CarList },
    { path: "/carrent/myrentlist", component: CarMyRentList },
    { path: "/carrent/myrentlist/:currentPage", component: CarMyRentList },
    { path: "/carrent/manage", component: CarManage },
    { path: "/carrent/manage/:currentPage", component: CarManage },
    { path: "/carrent/allrentlist", component: CarAllRentList },
    { path: "/carrent/allrentlist/:currentPage", component: CarAllRentList },
    { path: "/schedule/calendar", component: Calendar},
    { path: "/attendance", component: Attendance },
    { path: "/attendance/:currentPage", component: Attendance },
    { path: "/attendance/date/:currentPage", component: Attendance },
    { path: "/notice/noticelist", component: NoticeList },
    { path: "/notice/noticelist/:currentPage", component: NoticeList },
    { path: "/notice/:id", component: NoticeInfo },
    { path: "/meetingroom", component: MeetingRoomList },
    { path: "/meetingroom/:id", component: ReservationModal },
    { path: "/meetingroom/myreservation", component: MeetingRoomResList },
    {
      path: "/meetingroom/myreservation/:currentPage",
      component: MeetingRoomResList,
    },
    { path: "/meetingroom/timeline", component: MeetingRoomTimeline },
    { path: "/stuff/request", component: StuffRequest },
    { path: "/stuff/stuffmanage", component: StuffManage },
  ],
});

export default router;
