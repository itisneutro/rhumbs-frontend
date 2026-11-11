export interface RhumbsResponseDto {
  id: number;
  name: string;
  description: object | null;
  imageUrl: object | null;
  videoUrl: object | null;
  geoAzimuth: object | null;
  magAzimuth: object | null;
  likesCount: number;
  isCreator: 0 | 1;
  isLiked: 0 | 1;
}

export interface PublishRhumbsDto {
  name: string;
  description: string;
  geoAzimuth: number;
  magAzimuth: number;
}

export interface LikeRhumbsDto {
  isLiked: 0 | 1;
}

export interface RegisterUserDto {
  login: string;
  password: string;
}

export interface UserResponseDto {
  id: number;
  login: string;
}

export interface LoginUserDto {
  login: string;
  password: string;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  secure?: boolean;
  path: string;
  type?: ContentType;
  query?: QueryParamsType;
  format?: ResponseType;
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export const ContentType = {
  Json: "application/json",
  JsonApi: "application/vnd.api+json",
  FormData: "multipart/form-data",
  UrlEncoded: "application/x-www-form-urlencoded",
  Text: "text/plain",
} as const;
export type ContentType = (typeof ContentType)[keyof typeof ContentType];

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  rhumbs = {
    rhumbsControllerList: (
      query?: {
        minAzimuth?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<RhumbsResponseDto[], void>({
        path: `/api/rhumbs`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    rhumbsControllerCreate: (
      data: {
        name: string;
        image?: File;
        video?: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<RhumbsResponseDto, void>({
        path: `/api/rhumbs`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    rhumbsControllerFeed0: (
      query?: {
        next?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<RhumbsResponseDto, void>({
        path: `/api/rhumbs/feed`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    rhumbsControllerFeed1: (
      id: string,
      query?: {
        next?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<RhumbsResponseDto, void>({
        path: `/api/rhumbs/feed/${id}`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    rhumbsControllerDraft: (params: RequestParams = {}) =>
      this.request<RhumbsResponseDto, void>({
        path: `/api/rhumbs/draft`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    rhumbsControllerPublish: (
      data: PublishRhumbsDto,
      params: RequestParams = {},
    ) =>
      this.request<RhumbsResponseDto, void>({
        path: `/api/rhumbs/draft/publish`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    rhumbsControllerRemove: (id: number, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/api/rhumbs/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    rhumbsControllerLike: (
      id: number,
      data: LikeRhumbsDto,
      params: RequestParams = {},
    ) =>
      this.request<RhumbsResponseDto, void>({
        path: `/api/rhumbs/${id}/like`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}
