package com.cg4academy.backend.dto;

public class ApiResponse<T> {
    private int code;
    private String message;
    private T data;
    private Object error;

    public ApiResponse() {
    }

    public ApiResponse(int code, String message, T data, Object error) {
        this.code = code;
        this.message = message;
        this.data = data;
        this.error = error;
    }

    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(200, "Success", data, null);
    }

    public static <T> ApiResponse<T> success(T data, String message) {
        return new ApiResponse<>(200, message, data, null);
    }

    public static <T> ApiResponse<T> error(int code, String message, Object error) {
        return new ApiResponse<>(code, message, null, error);
    }

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    public Object getError() {
        return error;
    }

    public void setError(Object error) {
        this.error = error;
    }
}
