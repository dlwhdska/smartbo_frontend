<template>
    <div class="modal-wrap" >
        <div class="modal-container">
                <button v-if="modifyCheck==false" class="cancel" @click="$emit('closeModal')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                </svg></button>
                <button v-if="modifyCheck" class="cancel" @click="modifyModal"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                </svg></button><br>
            <div class="schedule-detail" v-if="modifyCheck==false">
                <span class="detail-label">제목</span> <span style="font-size: 15px;">{{c.title}}</span><br>
                <hr><br>
                <div>
                    <div class="startdiv">
                        <span style="font-size: 20px;">{{formatYYYYmmdd(c.start)}}</span><br>
                        <span style="font-size: 17px;">{{formatHHmmss(c.start)}}</span>
                    </div>
                    <div class="enddiv">
                        <span style="font-size: 20px;">{{c.end? formatYYYYmmdd(c.end) : formatYYYYmmdd(c.start)}}</span><br>
                        <span style="font-size: 17px;">{{c.end? formatHHmmss(c.end):formatHHmmss(c.start)}}</span>
                    </div>
                </div><br>
                <hr><br>
                <span v-if="c.extendedProps.memo" class="detail-label">메모</span><br><br>
                <span style="text-align: justify;">{{c.extendedProps.memo}}</span><br><br><br>
            </div>
            <div class="modal-btn" v-if="modifyCheck==false">
                <button type="submit" class="ok" @click="modifyModal">수정</button>
                <button class="delete" @click="deleteHandler">삭제</button>
            </div>
            <div class="modify-detail" v-if="modifyCheck==true">
                <form>
                    <label>제목 </label><input class="title"
                                                type="text" 
                                                name="scheduleTitle"
                                                v-model="schedule.scheduleTitle"
                                                maxlength="15"
                                                placeholder="15자 이내로 입력하세요"
                                                required><br><br>
                    <label>기간</label><input type="date"
                                        name="startDate"
                                        v-model="startDate"
                                        required> <input type="time"
                                                            name="start"
                                                            v-model="sTime"
                                                            required><br><br>
                    <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>~ <input type="date"
                        name="endDate"
                        v-model="endDate"
                        :min ="startDate"
                        required> <input type="time"
                                            name="endtime"
                                            v-model="eTime"
                                            :min ="sTime"
                                            required><br><br><br>
                    <label>메모 </label><textarea type="text" 
                                                class="content"
                                                name="content" 
                                                v-model="schedule.content"
                                                maxlength="60"
                                                placeholder="60자 이내로 입력하세요"></textarea>
                    <div class="modal-btn" v-if="modifyCheck">
                        <button type="submit" class="ok" @click="modifyHandler">완료</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios'

export default {
    name: 'ScheduleInfo',
    components: {
        
    },
    props: ["detailModalCheck", "c" ],
    data() {
        return {
            modifyCheck: false,
            startDate: null,
            endDate: null,
            sTime: null,
            eTime: null,
            schedule: {
                id : '',
                startTime : null,
                endTime : null,
                scheduleTitle :  '' ,
                content : '',
                member : {
                    id : ''
                }
            }
        }
    },
    methods: {
        modifyModal(){
                this.schedule.scheduleTitle = this.c.title 
                this.schedule.content = this.c.extendedProps.memo
                this.startDate = this.formatYYYYmmdd(this.c.start)
                this.sTime = this.formatHHmmss(this.c.start)

                if(this.c.end==null){
                    this.endDate = this.formatYYYYmmdd(this.c.start)
                    this.eTime = this.formatHHmmss(this.c.start)
                }else{
                    this.endDate = this.formatYYYYmmdd(this.c.end)
                    this.eTime = this.formatHHmmss(this.c.end)
                }

                console.log(this.schedule.scheduleTitle)
                console.log(this.schedule.content)
                this.modifyCheck = !this.modifyCheck
        },
        closeModal(){
            // window.location.reload()
            this.detailModalCheck = !this.detailModalCheck
            this.$emit("closeModal",this.detailModalCheck)
        },
        formatYYYYmmdd(date){
            console.log(date)
            if(date!==null){
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
    
                return `${year}-${month}-${day}`
            }else{
                return date
            }
        },
        formatHHmmss(date){
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');
    
                return `${hours}:${minutes}`
        },
        modifyHandler(){
            console.log(this.c.extendedProps.eventId)
            this.schedule.id = this.c.extendedProps.eventId
            console.log(this.schedule.id)
            if(this.endDate<this.startDate){
                alert("올바른 날짜 기입이 아닙니다. 기간을 다시 확인하세요.")
                return false
            }

            if(this.eTime<this.sTime){
                alert("올바른 시간 기입이 아닙니다. 시간을 다시 확인하세요.")
                return false
            }
            
            this.schedule.startTime = `${this.startDate} ${this.sTime}:00`
            this.schedule.endTime = `${this.endDate} ${this.eTime}:00`

            const url = `${this.backURL}/schedule/modify`
            const data = this.schedule
            console.log(data)

            axios.put(url,data)
                .then((Response)=>{
                    if(Response.status==200){
                        alert('수정되었습니다')
                        // this.modifyCheck = !this.modifyCheck
                        window.location.reload()
                    }
                })
                .catch((Error)=>{
                    console.log(Error)
                })
        },
        deleteHandler(){
            const id = this.c.extendedProps.eventId
            const url = `${this.backURL}/schedule/delete/${id}`

            if(confirm("삭제하시겠습니까?")){
                axios.delete(url)
                .then((Response)=>{
                    if(Response.status==200){
                        alert('삭제되었습니다')
                        window.location.reload()
                    }
                })
                .catch((Error)=>{
                    console.log(Error)
                })
            }
        }
    },
    created(){
        const memberId = localStorage.getItem('memberId')
        this.schedule.member.id = memberId
    }
}
</script>
<style scoped>
.modal-wrap {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}
/* modal or popup */
.modal-container {
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 550px;
  background: #fff;
  border-radius: 10px;
  padding: 50px;
  padding-top : 30px;
  box-sizing: border-box;
  box-shadow: 0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);
}
.schedule-detail, .modify-detail{
    margin-top : 30px;
}
.modal-btn{
    margin-top : 50px;
    text-align: center;
}
.ok, .delete{
    background-color: #2196f3;
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}
.ok:hover {
    background-color: #2189df;
}
.cancel:hover {
    color: #58b5c5;
}
.delete:hover {
    background-color: #2189df;
}
.ok{
    margin-right : 20px;
}
.cancel{
    float: right;
    color: #58d3e9;
}
.detail-label{
    color : black;
    font-size: 15px;
    font-weight: 700;
    padding-right : 40px;
    vertical-align: top;
}
hr{
    border : solid 1px #cccccc;
}
.startdiv, .enddiv{
    width: 50%;
    text-align: center;
    display: inline-block;

}
.startdiv{
    border-right: solid 1px #e6e6e6;
}

label{
    /* color : #02449b; */
    font-weight: 700;
    font-size: 15px;
    padding-right : 40px;
    vertical-align: top;
}

input{
    border : 1px solid #d8d8d8;
    height : 35px;
    font-size : 13px;
}

.title{
    width: 300px;
}
.content{
    border : 1px solid #d8d8d8;
    border-radius: 5px;
    font-size : 15px;
    width: 300px;
    height: 100px;
    resize: none;
    font-size : 13px;
    padding: 10px;
}
</style>