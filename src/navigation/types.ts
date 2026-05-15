import type { UserSchema, BusinessUnitSchema, AWSSchema, OutletSchema, RouteSchema, ProgramSchema } from '../database/schema';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  BUSelection: { user: UserSchema };
  AWSSelection: { user: UserSchema; businessUnit: BusinessUnitSchema };
  OpenStock: { user: UserSchema; businessUnit: BusinessUnitSchema; aws: AWSSchema };
  StartSession: { user: UserSchema; businessUnit: BusinessUnitSchema; aws: AWSSchema };
};

export type MainTabParamList = {
  Dashboard: undefined;
  Routes: undefined;
  Sales: undefined;
  Stock: undefined;
  More: undefined;
};

export type DashboardStackParamList = {
  DashboardHome: undefined;
};

export type RoutesStackParamList = {
  RoutePlan: undefined;
  OutletSelection: { route: RouteSchema };
  CheckIn: { outlet: OutletSchema; route: RouteSchema };
  LoadPrograms: { outlet: OutletSchema; route: RouteSchema };
  CreateSale: { outlet: OutletSchema; route: RouteSchema; programs: ProgramSchema[] };
  CheckOut: { outlet: OutletSchema; route: RouteSchema };
};

export type SalesStackParamList = {
  SalesHistory: undefined;
  SaleDetail: { saleId: string };
};

export type StockStackParamList = {
  StockOverview: undefined;
};

export type MoreStackParamList = {
  Settlement: undefined;
  CloseSession: undefined;
};
