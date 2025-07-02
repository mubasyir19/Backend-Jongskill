export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export class ResponseUtil {
  static success<T>(data: T, message = 'Success'): ApiResponse<T> {
    return {
      success: true,
      message,
      data,
    };
  }

  static error(message: string, errors?: any): ApiResponse {
    return {
      success: false,
      message,
      errors,
    };
  }

  static paginated<T>(data: T[], page: number, limit: number, total: number, message = 'Success'): ApiResponse<T[]> {
    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      message,
      data,
      meta: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }
}
