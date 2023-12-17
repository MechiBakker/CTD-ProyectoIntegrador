package com.dh.equipo2.roadRunner.util;
import com.dh.equipo2.roadRunner.dto.VehicleDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public class PostResponse {
        private List<VehicleDto> content;
        private int pageNo;
        private int pageSize;
        private long totalElements;
        private int totalPages;
        private boolean last;
    }

