import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import env from '../../../../../config/environment';

export default class AxiosHelper {
    static requestConfigDefaults = {
        timeout: env.axios.timeout,
        validateStatus: AxiosHelper.validateStatus,
    };

    static create(config?: AxiosRequestConfig): AxiosInstance {
        const requestConfig = { ...config, ...AxiosHelper.requestConfigDefaults };
        return axios.create(requestConfig);
    }

    private static validateStatus(status: number): boolean {
        return (status >= 200 && status < 300) || status === 404;
    }
}
