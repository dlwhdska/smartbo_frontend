<template>
    <main>
        <div class="calendar">
            <FullCalendar 
                :options="calendarOptions"
                @dateClick="handleDateClick"
                @resourceClick="handleResourceClick"
            >
            </FullCalendar>
        </div>
    </main>
</template>
<script>
    import FullCalendar from '@fullcalendar/vue3'
    import interactionPlugin from '@fullcalendar/interaction'
    import { Calendar } from '@fullcalendar/core';
    import resourceTimelinePlugin from '@fullcalendar/resource-timeline'
    import MeetingRoomItem from '@/pages/meetingroom/MeetingRoomItem.vue'
    import axios from 'axios'
    
    export default {
        name: 'Calendar',
        props:['mr', 'date'],
        components: {
            FullCalendar, MeetingRoomItem
        },
        data() {
            return {
                meetingroomlist: [],
                date: '',            
                calendarOptions: {
                    plugins: [ interactionPlugin, resourceTimelinePlugin],
                    initialView: 'resourceTimelineDay',
                    headerToolbar: {
                        left: 'today prev,next',
                        center: 'title',
                        right: 'resourceTimelineDay',
                    },
                    resourceAreaHeaderContent: 'Rooms',
                    scrollTime: '08:00',
                    resources: [
                        {
                            id: 0,
                            title: '',
                            name: '',
                            maxNum: 0,
                            monitor: 0,
                            socket: 0,
                            projector: 0,
                            marker: 0,
                            location: ''
                        },
                    ],
                    events: [
                        {
                            resourceId: 49,
                            title: 'Event 2',
                            start: '2023-12-18T14:00:00',
                            end: '2023-12-18T16:00:00'
                        },
                    ],
                    eventContent: { html: '<i>some html</i>' },
                    resourceAreaColumns: [
                        {
                            field: 'name',
                            cellContent: {
                                html:
                                `<img src="../../images/회의실1.jpg" style="width:200px; height:200px;"></img>
                                <br>
                                회의실1
                                <br>
                                <button class="resbutton" @click="openModal">
                                    <span><b>예약하기</b></span>
                                </button>
                                <Modal 
                                :show="showModal"
                                :mr = "mr"
                                @close="closeModal"/>
                                `
                            },
                        },
                    ]
                },
                meetingRoomData: {},
            }
        },
        methods: {
            handleDateClick(arg) {
                alert(arg.date);
            },
            updateList() {
                this.date = '2023-12-18'

                const url = `${this.backURL}/meetingroom?meetingDate=${this.date}`
                axios.get(url)
                    .then(response=>{
                        this.calendarOptions.resources = [];
                        this.calendarOptions.events = [];
                        response.data.forEach(item => {
                            console.log(item);
                            const itemtitle = `${item.name} (${item.location})`
                            const resource = {
                                id: item.id,
                                title: itemtitle,
                                name: item.name,
                                maxNum: item.maxNum,
                                monitor: item.monitor,
                                socket: item.socket,
                                projector: item.projector,
                                marker: item.marker,
                                location: item.location
                            };

                            const combinedstart = `${item.reservation.meetingDate}T${item.reservation.startTime}:00`;
                            const combinedend = `${item.reservation.meetingDate}T${item.reservation.endTime}:00`;
                            const startTime = new Date(combinedstart);
                            const endTime = new Date(combinedend);
                            const event = {
                                id: item.reservation.id,
                                start: startTime,
                                end: endTime,
                                startTime: startTime,
                                endTime: endTime,
                                meetingDate: item.reservation.meetingDate,
                                purpose: item.reservation.purpose,
                                member: item.reservation.member,
                                meetingroom: item.reservation.meetingroom,
                                participants: item.reservation.participants,
                            }
                            this.calendarOptions.resources.push(resource);
                            this.calendarOptions.events.push(event);
                        });

                        this.meetingRoomData = response.data;
                        console.log(this.date)
                    })
                    .catch((error) =>{
                        console.log(error)
                    })
            },
            handleResourceClick(resource, el, view) {
                // 리소스를 클릭할 때 발생하는 이벤트 핸들러
                console.log('Resource Clicked:', resource);
                console.log("클릭됨");
            },
        },
        watch: {
            //----라우터값이 변경되었을 때 할 일 START----
            $route(newRoute, oldRoute) {
                console.log("라우터값이 변경" + newRoute.path + "," + oldRoute.path)
                if (newRoute.params.date) {
                    this.date = newRoute.params.date
                } else {
                    this.date = ''
                }
                this.updateList(this.date)
            },
            //----라우터값이 변경되었을 때 할 일 END----
        },
        created(){
            this.updateList();
        }
    }
</script>
<style scoped>
.calendar {
    width: 90%;
    height: 100px;

    margin-left: 100px;
    margin-right: auto;
    margin-top: 50px;
}


img {
  width: 200px;
  height: 200px;
}

td {
  width: 150rem;
  height: 80px;
  padding: 8px;
  text-align: left;
  border-bottom: 1px solid #ddd;
  text-align: center;
}

.roomname {
    margin-top: 5px;
}

.resbutton {
  display: inline-block;

  border-radius: 4px;
  background: var(--dark);
  color: #ddd;
  border: none;

  text-align: center;
  font-size: 14px;

  padding: 5px;
  width: 100px;
  height: 35px;
  vertical-align: middle;
  align-items: center;

  transition: all 0.5s;
  cursor: pointer;
  margin: 5px;
  margin-top: 10px;
}

.resbutton span {
  cursor: pointer;
  display: inline-block;
  position: relative;
  transition: 0.5s;
  vertical-align: middle;
  align-items: center;
}

.resbutton span:after {
  content: '\00bb';
  position: absolute;
  opacity: 0;
  top: 0;
  right: -20px;
  transition: 0.5s;
}

.resbutton:hover span {
  padding-right: 15px;
}

.resbutton:hover span:after {
  opacity: 1;
  right: 0;
}

/* container css*/
.flex-container {
    overflow-x: auto;
}

.timebar {
  display: flex;
  flex-wrap: wrap;
  /* padding: 8px; */
  width: auto;
  height: auto;
  /* text-align: left; */
  text-align: center;
}

.time-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid lightgray;
    padding-right: 10px;
    margin-right: 10px;
}

.reservation-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 30px;

    padding-right: 10px;
    margin-right: 10px;
}

.time-slot {
  flex: 0 0 100px;
  padding: 8px;
  height: 100%;
  text-align: center;
  border-left : 1px solid lightgray;
  border-bottom : 1px solid lightgray;
}

/* 네모 박스 스타일 지정 */
.reservation-box {
  /* position: absolute; */
  width: 100%;
  height: 10px;
  background-color: lightblue;
  border: 1px solid #ccc;
}

    
</style>