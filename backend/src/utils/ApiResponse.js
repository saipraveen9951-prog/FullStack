export class ApiResponse {
  constructor(statusCode, data, message = 'Success', pagination = null) {
    this.statusCode = statusCode;
    this.success = true;
    this.message = message;
    this.data = data;
    if (pagination) {
      this.pagination = pagination;
    }
  }
}
