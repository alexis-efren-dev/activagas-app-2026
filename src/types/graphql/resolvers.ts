/**
 * GraphQL Resolver Response Types
 * Generated based on existing GraphQL queries
 */

// ============================================
// Common Paginated Response
// ============================================
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
}

// ============================================
// Client Types
// ============================================
export interface ClientData {
  _id: string;
  firstName: string;
  cellPhone: string;
  idClientSigned?: string;
}

export interface GetClientsResolverResponse {
  getClientsResolver: PaginatedResponse<ClientData>;
}

// ============================================
// Vehicle Types
// ============================================
export interface VehicleData {
  _id: string;
  idGas: string;
  plates: string;
  model: string;
  serialNumber: string;
  whatsappSupport?: string;
  serialPlates?: string;
}

export interface GetVehiclesResolverResponse {
  getVehiclesResolver: PaginatedResponse<VehicleData>;
}

export interface VehicleEmergencyActivation {
  key: string;
  value: string;
}

export interface VehicleToEditData {
  _id: string;
  idClient: string;
  serialNumber: string;
  brand: string;
  idPayment: string;
  allGas: boolean;
  plates: string;
  model: string;
  circulationSerial: string;
  tankSerial: string;
  inactivityDays: number;
  numberOfMonthsContract: number;
  cylinders: number;
  others: string;
  totalPrice: number;
  isPriceEditable: boolean;
  service: string;
  calendar: string;
  frequencySelected: string;
  limitPay: number;
  maintenance: string;
  frequencySelectMaintenance: string;
  initialLiterPolicy: number;
  initialActivationPolicy: number;
  parsedPolicies: string;
  isNaturalGas: boolean;
  finalDateToPay: string;
  withMileage: boolean;
  timeOff: number;
  vehicleEmergencyActivations: VehicleEmergencyActivation[];
}

export interface GetInfoVehicleToEditResolverResponse {
  getInfoVehicleToEditResolver: VehicleToEditData;
}

// ============================================
// Reassignment Types
// ============================================
export interface ReassignmentData {
  _id: string;
  plates: string;
  model?: string;
  brand?: string;
  serialNumber?: string;
}

export interface GetReassignmentByPlatesResolverResponse {
  getReassignmentByPlatesResolver: ReassignmentData;
}

// ============================================
// Configuration Types
// ============================================
export interface GetReadTimeAppResolverResponse {
  getReadTimeAppResolver: number;
}

// ============================================
// User Types
// ============================================
export interface UserToEditData {
  _id: string;
  firstName?: string;
  lastName?: string;
  cellPhone?: string;
  email?: string;
}

export interface GetInfoToEditUserResolverResponse {
  getInfoToEditUserResolver: UserToEditData;
}

// ============================================
// Services/Maintenances Types
// ============================================
export interface ServiceData {
  _id: string;
  name: string;
  description?: string;
}

export interface GetServicesAppResolverResponse {
  getServicesAppResolver: ServiceData[];
}

export interface MaintenanceData {
  _id: string;
  name: string;
  description?: string;
}

export interface GetMaintenancesAppResolverResponse {
  getMaintenancesAppResolver: MaintenanceData[];
}

// ============================================
// Gaseras Types
// ============================================
export interface GaseraData {
  _id: string;
  name: string;
}

export interface GaserasTableResolverResponse {
  gaserasTableResolver: PaginatedResponse<GaseraData>;
}

export interface GaserasPrivateResolverResponse {
  gaserasPrivateResolver: PaginatedResponse<GaseraData>;
}

// ============================================
// Serial Numbers Types
// ============================================
export interface SerialNumberData {
  _id: string;
  serialNumber: string;
  status?: string;
}

export interface GetSerialNumbersAccountingResolverResponse {
  getSerialNumbersAccountingResolver: PaginatedResponse<SerialNumberData>;
}

// ============================================
// Emergency Types
// ============================================
export interface EmergencyVehicleData {
  _id: string;
  plates: string;
  status: string;
}

export interface GetEmergencyVehicleResolverResponse {
  getEmergencyVehicleResolver: EmergencyVehicleData;
}

// ============================================
// History Types
// ============================================
export interface HistoryPayData {
  _id: string;
  amount: number;
  date: string;
}

export interface GetHistoryPayResolverResponse {
  getHistoryPayResolver: HistoryPayData[];
}

export interface HistoryMaintenanceData {
  _id: string;
  description: string;
  date: string;
}

export interface GetHistoryMaintenanceResolverResponse {
  getHistoryMaintenanceResolver: HistoryMaintenanceData[];
}

// ============================================
// Other Resolvers
// ============================================
export interface EnabledVehicleData {
  _id: string;
  plates: string;
  disabled: boolean;
}

export interface GetEnabledVehicleResolverResponse {
  getEnabledVehicleResolver: EnabledVehicleData;
}

export interface DateVerificationData {
  nextDate: string;
  daysRemaining: number;
}

export interface GetDateVerificationResolverResponse {
  getDateVerificationResolver: DateVerificationData;
}

export interface InternalVinData {
  vin: string;
  isValid: boolean;
}

export interface GetInternalVinResolverResponse {
  getInternalVinResolver: InternalVinData;
}

export interface UserByData {
  _id: string;
  firstName: string;
  lastName: string;
}

export interface ReadUserByResolverResponse {
  readUserByResolver: UserByData;
}
