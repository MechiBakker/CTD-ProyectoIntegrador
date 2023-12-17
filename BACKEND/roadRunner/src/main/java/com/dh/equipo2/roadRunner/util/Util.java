package com.dh.equipo2.roadRunner.util;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class Util {
    public static List<String> getArraydates(LocalDate initialDate, LocalDate finalDate) {
        List<String> dates = new ArrayList<>();
        LocalDate actualDate = initialDate;

        while (!actualDate.isAfter(finalDate)) {
            dates.add(actualDate.toString());
            actualDate = actualDate.plusDays(1);
        }
        return dates;
    }

    public static Timestamp dateToTimestamp(Date date){
        Timestamp timestamp = new Timestamp(date.getTime());
        return timestamp;
    }

}
