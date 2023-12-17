package com.dh.equipo2.roadRunner.exceptions;

import com.dh.equipo2.roadRunner.util.Util;
import lombok.Data;

import java.util.Date;

@Data
public class ErrorMessage {

    private int statusCode;
    private Date timeStamp;
    private String message;
    private String description;

    public ErrorMessage() {
        Date date = new Date();
        this.timeStamp = Util.dateToTimestamp(date);
    }

}
