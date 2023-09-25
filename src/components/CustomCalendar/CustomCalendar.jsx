import React, { useState, useMemo, useEffect } from "react"
import { View, Text, StyleSheet } from "react-native"
import { Calendar } from "react-native-calendars"

const CustomCalendar = (props) => {
  const { initialDate } = props
  const [selected, setSelected] = useState(initialDate)
  const [selected2, setSelected2] = useState(initialDate)

  const currentDate = new Date()
  const formattedDate = `${currentDate.getFullYear()}/${(
    "0" +
    (currentDate.getMonth() + 1)
  ).slice(-2)}/${currentDate.getDate()}`
  console.log(initialDate)

  const [selectFirstDate, setSelectFirstDate] = useState("")
  const [selectLastDate, setSelectLastDate] = useState("")
  //   const marked = useMemo(
  //     () => ({
  //       [selected]: {
  //         customStyles: {
  //           container: {
  //             borderRadius: 15,
  //           },
  //         },
  //         selected: true,
  //         selectedColor: "#3693CF",
  //         selectedTextColor: "white",
  //       },
  //       [selected2]: {
  //         customStyles: {
  //           container: {
  //             borderRadius: 15,
  //           },
  //         },
  //         selected: true,
  //         selectedColor: "#3693CF",
  //         selectedTextColor: "white",
  //       },
  //     }),
  //     [selected, selected2],
  //   )

  //   const getMarked = (first_date, last_date) => {
  //     let marked = {}
  //     for (let i = 1; i <= 10; i++) {
  //       let day = i.toString().padStart(2, "0")
  //       marked[first_date] = {
  //         startingDay: i == 1,
  //         endingDay: i == 10,
  //         color: "#3693CF",
  //         textColor: "black",
  //         disabled: true,
  //       }
  //     }
  //     return marked
  //   }

  const selectDates = (date) => {
    if (
      selectFirstDate === "" ||
      selectFirstDate === null ||
      selectFirstDate === undefined
    ) {
      setSelectFirstDate(date)
      setSelected(date)
    } else if (
      (selectFirstDate !== "" && selectLastDate === "") ||
      selectLastDate === null ||
      selectLastDate === undefined
    ) {
      setSelectLastDate(date)
      setSelected2(date)
    } else if (selectFirstDate && selectLastDate) {
      setSelectFirstDate(date)
      setSelectLastDate("")
      setSelected(date)
      setSelected2(2)
    }
  }

  //   useEffect(() => {
  //     if (selectFirstDate !== "") {
  //       console.log(selectFirstDate)
  //     }
  //   })

  //   useEffect(() => {
  //     if (selectLastDate !== "") {
  //       console.log(selectLastDate)
  //     }
  //   })

  //   useEffect(() => {
  //     if (selectFirstDate && selectLastDate) {
  //       getMarked(selectFirstDate, selectLastDate)
  //     }
  //   }, [selectFirstDate, selectLastDate])

  const selectedDates = {
    [selected]: {
      customStyles: {
        container: {
          borderRadius: 15,
        },
      },
      selected: true,
      selectedColor: "#3693CF",
      selectedTextColor: "white",
    },
    [selected2]: {
      customStyles: {
        container: {
          borderRadius: 15,
        },
      },
      selected: true,
      selectedColor: "#a136cf",
      selectedTextColor: "white",
    },
  }

  return (
    <View>
      <Calendar
        markingType="custom" // Needed to use customStyle
        // markingType="period"
        initialDate={initialDate}
        style={style.calendar}
        onDayPress={(day) => {
          //   setSelected(day.dateString)
          selectDates(day.dateString)
          props.onDaySelect && props.onDaySelect(day)
        }}
        // onDayLongPress={(day) => console.log("onDayLongPress", day.dateString)}
        // onMonthChange={(date) => console.log("onMonthChange", date)}
        // onPressArrowLeft={(goToPreviousMonth) => {
        //   console.log("onPressArrowLeft")
        //   goToPreviousMonth()
        // }}
        // onPressArrowRight={(goToNextMonth) => {
        //   console.log("onPressArrowRight")
        //   goToNextMonth()
        // }}
        // showWeekNumbers={true}
        firstDay={+1}
        markedDates={selectedDates}
        {...props}
      />
    </View>
  )
}

export default CustomCalendar

const style = StyleSheet.create({
  calendar: {
    marginHorizontal: 16,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#3693CF",
    overflow: "hidden",
  },
})
