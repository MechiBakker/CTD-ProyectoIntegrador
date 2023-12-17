import React, { useState } from 'react'
import { enGB } from 'date-fns/locale'
import { FiArrowRight } from 'react-icons/fi'
import { BsCalendarEventFill } from 'react-icons/bs';
import { DateRangePicker, START_DATE, END_DATE } from 'react-nice-dates'
import 'react-nice-dates/build/style.css'

import './datepicker.css'

export const DateRangePickerComponent = () => {

  const [startDate, setStartDate] = useState()
  const [endDate, setEndDate] = useState()
  
  return (
    <DateRangePicker
      startDate={startDate}
      endDate={endDate}
      onStartDateChange={setStartDate}
      onEndDateChange={setEndDate}
      minimumDate={new Date()}
      minimumLength={1}
      format='dd MMM yyyy'
      locale={enGB}
    >
      {({ startDateInputProps, endDateInputProps, focus }) => {
        return (
        <div className='date-range'>
          <BsCalendarEventFill className='calendar-icon' />
          <input
            className={'input' + (focus === START_DATE ? ' -focused' : '')}
            {...startDateInputProps}
            value = { startDateInputProps.value && endDateInputProps.value ? startDateInputProps.value + ' - ' + endDateInputProps.value : '' }
            placeholder='Registro de entrada y salida'
          />
        </div>
      )}
      
      }
    </DateRangePicker>
  )
}