package com.dh.equipo2.roadRunner.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.PutObjectRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

@Service
@Slf4j
public class ImageService {

    @Autowired
    private AmazonS3 amazonS3;

    @Value("${aws.s3.bucketName}")
    private String bucketName;


    public void uploadImage(String fileName, MultipartFile file){
        File convertedFile = this.convertMultiPartFileToFile(file);
        amazonS3.putObject(new PutObjectRequest(bucketName,
                fileName,
                convertedFile).withCannedAcl(CannedAccessControlList.PublicRead));
        convertedFile.delete();
    }

    private File convertMultiPartFileToFile(MultipartFile file) {
        File convertedFile = new File(file.getOriginalFilename());
        try (FileOutputStream fileOutputStream = new FileOutputStream(convertedFile)) {
            fileOutputStream.write(file.getBytes());
        } catch (IOException e) {
            log.error("Error al convertir el tipo de archivo", e);
        }
        return convertedFile;
    }

    public String getUrlImage(String key){
        return String.valueOf(amazonS3.getUrl(bucketName, key));
    }
}
