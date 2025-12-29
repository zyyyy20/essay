package com.blog.exception;

import com.blog.dto.Result;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
    
    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);
    
    @ExceptionHandler(Exception.class)
    public Result<String> handleException(Exception e) {
        logger.error("系统异常", e);
        return Result.error("系统异常，请稍后重试");
    }
    
    @ExceptionHandler(RuntimeException.class)
    public Result<String> handleRuntimeException(RuntimeException e) {
        logger.error("运行时异常", e);
        return Result.error("系统异常，请稍后重试");
    }
}