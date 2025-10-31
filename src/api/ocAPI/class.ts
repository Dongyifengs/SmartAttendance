export interface OCLoginData {
    school_no: string;
    work_no: string;
    password: string;
}

export interface OCLoginRequestBody {
    appid: string;
    from: number;
    data: OCLoginData;
    token: string;
}