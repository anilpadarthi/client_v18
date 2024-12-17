
  export interface ICommonResponse {
    status: boolean;
    responseCode: number;
    statusCode: number;
    message: string;
    data: any;
    count:number;
  }

  export interface ILoginResponse {
    status: boolean;
    responseCode: number;
    statusCode: number;
    message: string;
    data: IData;
   
}

export interface IData {
  token: string;
  userDetails:ILogin;
  userOptions: IOption[];
}

export interface ILogin {
  userId: number;
  userName: string;
  email: string;
  mobile: string | null;
  password: string;
  userRoleId: number;
  address: string | null;
  locality: string;
  isActive: boolean;
  createdDate: string;
  updatedDate: string;
  userPayRole: number;
  image: string;
  userRole: {
    userRoleId: number;
    roleName: string;
  }
}

export interface IOption {
  optionName: string;
  userOptionAccessId: number;
  userOptionId: number;
  userRoleId: number;
  isCreate: boolean;
  isUpdate: boolean;
  isDelete: boolean;
  isRead: boolean;
}