package com.finance.dashboard.exception;

import com.finance.dashboard.dto.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFound.class)
    public ErrorResponse handleNotFound(
            ResourceNotFound ex,
            HttpServletRequest request
    ) {
        return new ErrorResponse(
                LocalDateTime.now(),
                HttpStatus.NOT_FOUND.value(),
                ex.getMessage(),
                request.getRequestURI()
        );
    }

    @ExceptionHandler(BadRequest.class)
    public ErrorResponse handleBadRequest(
            BadRequest ex,
            HttpServletRequest request
    ) {
        return new ErrorResponse(
                LocalDateTime.now(),
                HttpStatus.BAD_REQUEST.value(),
                ex.getMessage(),
                request.getRequestURI()
        );
    }

    @ExceptionHandler(AccessDenied.class)
    public ErrorResponse handleAccessDenied(
            AccessDenied ex,
            HttpServletRequest request
    ) {
        return new ErrorResponse(
                LocalDateTime.now(),
                HttpStatus.FORBIDDEN.value(),
                ex.getMessage(),
                request.getRequestURI()
        );
    }

    // 🔥 Fallback (important)
    @ExceptionHandler(Exception.class)
    public ErrorResponse handleGlobalException(
            Exception ex,
            HttpServletRequest request
    ) {
        return new ErrorResponse(
                LocalDateTime.now(),
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "Something went wrong",
                request.getRequestURI()
        );
    }
}