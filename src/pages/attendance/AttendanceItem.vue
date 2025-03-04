<template>
    <tr>
        <td>{{ a.attendanceDate }}</td>
        <td>{{ a.startTime }}</td>
        <td>{{ a.endTime }}</td>
        <td :class="statusType(a.status)">
            {{
                a.status === 0 ? "출근"
                :a.status === 1 ? "지각"
                : a.status === 2 ? "결근"
                : a.status === 3 ? "병가"
                : a.status === 4 ? "휴가"
                : a.status === 5 ? "조퇴"
                : ""
            }}
        </td>
    </tr>
</template>
<script>
export default {
    name: "AttendanceItem",
    props: ["a"],
    data() {
        return {};
    },
    methods: {
        statusType(status) {
            switch (status) {
                case 0:
                    return "completed";
                case 1:
                    return "late";
                case 2:
                    return "absent";
                case 3:
                    return "sick";
                case 4:
                    return "vacation"
                case 5:
                    return "early"
                default :
                    return "";
            }
        }
    }
};
</script>
<style scoped>
td {
    padding: 10px;
    text-align: center;
    border-bottom: px solid #ddd;
    
}

.completed {
  /* Styles for '출근' */
  /* background-color: #cceeff; */
  color: #0040ff;
  font-weight: bolder;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.late {
  /* Styles for '지각' */
  /* background-color: #fff3cd; */
  color: #856404;
  font-weight: bolder;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.absent {
  /* Styles for '결근' */
  /* background-color: #ffd6cc;  */
  color: #ff0000;
  font-weight: bolder;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1); /* Shadow */
}

.early {
color: blueviolet;
  font-weight: bolder;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1); /* Shadow */
}

</style>
