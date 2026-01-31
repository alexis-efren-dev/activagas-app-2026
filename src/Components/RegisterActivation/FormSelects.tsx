import {Picker} from '@react-native-picker/picker';
import React, {useState} from 'react';
import {
  Dimensions,
  Text,
  TextInput,
  View,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {Calendar} from 'react-native-calendars';
import LinearGradient from 'react-native-linear-gradient';
import {Switch, Modal, Portal} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import {validateNumber} from '../../utils/validations';
import LitersActivations from './LitersActivations';
import {getServicesStore} from '../../redux/states/servicesSlice';
import {IStore} from '../../redux/store';

const {width, height} = Dimensions.get('screen');

interface ISelects {
  services: any;
  maintenances: any;
  setAutomaticPay: any;
  setTotalPrice: any;
  prevService?: any;
  prevCalendar?: any;
  prevFrequency?: any;
  prevLimitPay?: any;
  prevMaintenance?: any;
  prevFrequencyMaintenance?: any;
  initialLiterPolicy?: any;
  initialActivationPolicy?: any;
  parsedPolicies?: any;
  totalPrice: any;
  automaticPay: any;
  isPriceEditable?: any;
  endDateContract: any;
  setEndDateContract: any;
  newCredit?: any;
  setNewCredit?: any;
}

interface InputCardProps {
  icon: string;
  iconColor: string;
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  helperText?: string;
  editable?: boolean;
}

const InputCard: React.FC<InputCardProps> = ({
  icon,
  iconColor,
  label,
  placeholder,
  value,
  onChangeText,
  helperText,
  editable = true,
}) => (
  <View style={styles.inputCard}>
    <View style={styles.inputCardHeader}>
      <View style={[styles.inputIconContainer, {backgroundColor: `${iconColor}15`}]}>
        <Icon name={icon} size={18} color={iconColor} />
      </View>
      <Text style={styles.inputCardLabel}>{label}</Text>
    </View>
    <View style={styles.inputContainer}>
      <TextInput
        style={[styles.textInput, !editable && styles.textInputDisabled]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#999"
        keyboardType="numeric"
        editable={editable}
      />
    </View>
    {helperText && <Text style={styles.helperText}>{helperText}</Text>}
  </View>
);

interface SwitchRowProps {
  icon: string;
  iconColor: string;
  label: string;
  value: boolean;
  onValueChange: () => void;
}

const SwitchRow: React.FC<SwitchRowProps> = ({
  icon,
  iconColor,
  label,
  value,
  onValueChange,
}) => (
  <View style={styles.switchRow}>
    <View style={styles.switchRowLeft}>
      <View style={[styles.switchIconContainer, {backgroundColor: `${iconColor}15`}]}>
        <Icon name={icon} size={20} color={iconColor} />
      </View>
      <Text style={styles.switchRowLabel}>{label}</Text>
    </View>
    <Switch value={value} onValueChange={onValueChange} color="#1C9ADD" />
  </View>
);

const FormSelects: React.FC<ISelects> = ({
  services,
  maintenances,
  prevService,
  prevCalendar,
  prevFrequency,
  prevLimitPay,
  prevMaintenance,
  prevFrequencyMaintenance,
  initialLiterPolicy,
  initialActivationPolicy,
  parsedPolicies,
  setAutomaticPay,
  setTotalPrice,
  totalPrice,
  automaticPay,
  isPriceEditable = true,
  endDateContract,
  setEndDateContract,
  newCredit,
  setNewCredit,
}) => {
  // Get default IDs safely (with fallback to empty string if arrays are empty)
  const defaultServiceId = services.length > 0 ? services[0]._id : '';
  const defaultMaintenanceId = maintenances.length > 0 ? maintenances[0]._id : '';

  const initStore: any = {
    serviceSelect:
      prevService === '' || !prevService ? defaultServiceId : prevService,
    frequencySelect:
      prevFrequency === '' || !prevFrequency ? '0' : prevFrequency,
    maintenanceSelect:
      prevMaintenance === '' || !prevMaintenance
        ? defaultMaintenanceId
        : prevMaintenance,
    frequencySelectMaintenance:
      prevFrequencyMaintenance === '' || !prevFrequencyMaintenance
        ? '0'
        : prevFrequencyMaintenance,
    limitPay: prevLimitPay === '' || !prevLimitPay ? '1' : prevLimitPay,
    activationSelect: '',
    frequencySelectActivations: '',
    policies: [],
  };

  const [increaseCredit, setIncreaseCredit] = React.useState(false);
  const yiyi = parsedPolicies ? JSON.parse(parsedPolicies)[0] : '';
  const servicesStore = useSelector((store: IStore) => store.services);
  const dispatch = useDispatch();
  const [selectedServices, setSelectedService] = React.useState<any>(
    prevService || '',
  );
  const [typeService, setTypeService] = React.useState<any>('');
  const [serviceArray, setServiceArray] = React.useState<any>([]);
  const [methodSelected, setMethodSelected] = React.useState<any>('');
  const [frequencySelect, setFrequencySelect] = React.useState<any>(
    prevFrequency || '',
  );
  const [selectedMaintenances, setSelectedMaintenances] = React.useState<any>(
    prevMaintenance || '',
  );
  const [maintenanceArray, setMaintenanceArray] = React.useState<any>([]);
  const [frequencySelectMaintenance, setFrequencySelectMaintenance] =
    React.useState<any>(prevFrequencyMaintenance || '');
  const [serviceSelect, setServiceSelect] = React.useState<any>('');
  const [maintenanceSelect, setMaintenanceSelect] = React.useState<any>('');
  const [calendarControl, setCalendarControl] = React.useState<any>(
    prevCalendar || '',
  );
  const [markedDate, setMarkedDate] = React.useState<any>({
    colors: {selected: true, marked: true, selectedColor: '#1C9ADD'},
    date: `2020-03-${
      String(prevLimitPay).length <= 1
        ? '0' + String(prevLimitPay)
        : String(prevLimitPay)
    }`,
  });


  const [isWithPay, setIsWithPay] = React.useState(
    prevService && defaultServiceId && prevService !== defaultServiceId,
  );
  const onWithPay = () =>
    setIsWithPay(isPriceEditable ? !isWithPay : isWithPay);
  const [isWithMaintenance, setIsWithMaintenance] = React.useState(
    prevMaintenance && defaultMaintenanceId && prevMaintenance !== defaultMaintenanceId,
  );
  const onWithMaintenance = () => setIsWithMaintenance(!isWithMaintenance);
  const [limitPay, setLimitPay] = React.useState<any>(prevLimitPay || '1');
  const [isVisibleCalendar, setIsVisibleCalendar] = React.useState(false);

  React.useEffect(() => {
    if (selectedServices !== '') {
      setServiceSelect(selectedServices);
      const miService = services.filter(
        (data: any) => data._id === selectedServices,
      );
      setServiceArray(miService);
      if (miService[0].typeService === 'Day') {
        setTypeService(
          'Seleccionar dias de pago(seleccionar 0 en caso de ser a contado)',
        );
      } else if (miService[0].typeService === 'Week') {
        setTypeService('Seleccionar semanas de pago');
      } else {
        setTypeService('Seleccionar meses de pago');
      }
    } else {
      setTypeService('');
      setServiceArray([]);
    }
  }, [selectedServices]);

  React.useEffect(() => {
    if (selectedMaintenances !== '') {
      setMaintenanceSelect(selectedMaintenances);
      const miService = maintenances.filter(
        (data: any) => data._id === selectedMaintenances,
      );
      setMaintenanceArray(miService);
    } else {
      setMaintenanceArray([]);
    }
  }, [selectedMaintenances]);

  React.useEffect(() => {
    const infoSelected = services.filter(
      (service: any) => String(service._id) == serviceSelect,
    );
    if (infoSelected.length > 0) {
      setMethodSelected(infoSelected[0].name);
      if (!totalPrice) {
        if (infoSelected[0].name === 'Comodato') {
          setAutomaticPay('0');
          setTotalPrice('0');
        } else {
          setAutomaticPay('');
          setTotalPrice('');
        }
      }
    }
    if (serviceSelect !== '') {
      const newServices = {
        ...servicesStore,
        serviceSelect,
        frequencySelect: '1',
      };
      dispatch(getServicesStore(newServices));
    }
  }, [serviceSelect]);

  React.useEffect(() => {
    if (frequencySelect !== '') {
      const newServices = {...servicesStore, frequencySelect};
      dispatch(getServicesStore(newServices));
    }
  }, [frequencySelect]);

  React.useEffect(() => {
    if (maintenanceSelect !== '') {
      const newServices = {
        ...servicesStore,
        maintenanceSelect,
        frequencySelectMaintenance: frequencySelectMaintenance || '',
      };
      dispatch(getServicesStore(newServices));
    }
  }, [maintenanceSelect]);

  React.useEffect(() => {
    if (frequencySelectMaintenance !== '') {
      const newServices = {...servicesStore, frequencySelectMaintenance};
      dispatch(getServicesStore(newServices));
    }
  }, [frequencySelectMaintenance]);

  React.useEffect(() => {
    let newServices;
    if (limitPay === '') {
      newServices = {...servicesStore, limitPay: '1'};
    } else {
      newServices = {...servicesStore, limitPay};
    }
    dispatch(getServicesStore(newServices));
  }, [limitPay]);

  React.useEffect(() => {
    if (!isWithPay && defaultServiceId) {
      setSelectedService(defaultServiceId);
      setAutomaticPay('0');
      setTotalPrice('0');
      const newServices = {
        ...servicesStore,
        serviceSelect: defaultServiceId,
        frequencySelect: '0',
      };
      dispatch(getServicesStore(newServices));
    }
  }, [isWithPay]);

  React.useEffect(() => {
    if (!isWithMaintenance && defaultMaintenanceId) {
      setSelectedMaintenances(defaultMaintenanceId);
      const newServices = {
        ...servicesStore,
        maintenanceSelect: defaultMaintenanceId,
        frequencySelectMaintenance: '0',
      };
      dispatch(getServicesStore(newServices));
    }
  }, [isWithMaintenance]);

  React.useEffect(() => {
    if (prevService != '') {
      const initialPolicy = {
        liters: initialLiterPolicy,
        activation: initialActivationPolicy,
        method: '0',
      };
      let unionPolicy: any = [];
      const getKeys = Object.keys(yiyi);
      if (getKeys.length > 0) {
        const newData = [initialPolicy];
        for (let i of getKeys) {
          newData.push(yiyi[i]);
        }
        unionPolicy = newData;
      } else {
        unionPolicy = [initialPolicy];
      }
      initStore.policies = unionPolicy;
      dispatch(getServicesStore(initStore));
    }
  }, []);

  return (
    <View style={styles.container}>
      {/* Políticas de Carga Section */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionIconContainer}>
            <Icon name="gas-station" size={20} color="#FF5722" />
          </View>
          <Text style={styles.sectionTitle}>Políticas de Carga</Text>
        </View>
        <LitersActivations
          initialActivationPolicy={initialActivationPolicy}
          initialLiterPolicy={initialLiterPolicy}
          parsedPolicies={parsedPolicies}
        />
      </View>

      {/* Políticas de Activación Section */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <View style={[styles.sectionIconContainer, {backgroundColor: '#E3F2FD'}]}>
            <Icon name="credit-card" size={20} color="#1C9ADD" />
          </View>
          <Text style={styles.sectionTitle}>Políticas de Activación</Text>
        </View>

        <SwitchRow
          icon="cash"
          iconColor="#4CAF50"
          label="Pago"
          value={isWithPay}
          onValueChange={onWithPay}
        />

        {methodSelected === 'Comodato' && !isWithPay && (
          <InputCard
            icon="calendar-clock"
            iconColor="#9C27B0"
            label="Duración del Contrato"
            placeholder="Ingrese duración en meses"
            value={endDateContract}
            onChangeText={(text) => {
              if (validateNumber(text)) {
                setEndDateContract(text);
              }
            }}
            helperText="Meses"
            editable={isPriceEditable}
          />
        )}

        {isWithPay && (
          <View style={styles.paymentSection}>
            {/* Método de Financiamiento */}
            <View style={styles.pickerCard}>
              <View style={styles.pickerHeader}>
                <Icon name="bank" size={18} color="#1C9ADD" />
                <Text style={styles.pickerLabel}>Método de Financiamiento</Text>
              </View>
              <View style={styles.pickerContainer}>
                <Picker
                  enabled={isPriceEditable}
                  style={styles.picker}
                  dropdownIconColor="#1C9ADD"
                  selectedValue={selectedServices}
                  onValueChange={(itemValue) => {
                    const splitItem = itemValue.split(',');
                    setSelectedService(splitItem[0]);
                    setMarkedDate({
                      colors: {selected: true, marked: true, selectedColor: '#1C9ADD'},
                      date: '2020-03-01',
                    });
                    setCalendarControl(splitItem[1]);
                    setLimitPay('');
                  }}>
                  <Picker.Item
                    label="--Seleccionar método--"
                    value=""
                  />
                  {services.map((data: any) => (
                    <Picker.Item
                      key={data._id}
                      label={data.name}
                      value={`${data._id},${data.typeService}`}
                    />
                  ))}
                </Picker>
              </View>
              {methodSelected !== '' && (
                <View style={styles.selectedMethodBadge}>
                  <Icon name="check-circle" size={14} color="#4CAF50" />
                  <Text style={styles.selectedMethodText}>{methodSelected}</Text>
                </View>
              )}
            </View>

            {methodSelected === 'Comodato' && (
              <InputCard
                icon="calendar-clock"
                iconColor="#9C27B0"
                label="Duración del Contrato"
                placeholder="Ingrese duración en meses"
                value={endDateContract}
                onChangeText={(text) => {
                  if (validateNumber(text)) {
                    setEndDateContract(text);
                  }
                }}
                helperText="Meses"
                editable={isPriceEditable}
              />
            )}

            {calendarControl &&
              methodSelected !== 'Contado' &&
              methodSelected !== 'Comodato' && (
                <>
                  <TouchableOpacity
                    style={styles.calendarButton}
                    onPress={() => setIsVisibleCalendar(true)}
                    activeOpacity={0.8}>
                    <LinearGradient
                      style={styles.calendarButtonGradient}
                      colors={['#1C9ADD', '#0D7ABC']}
                      start={{x: 0, y: 0}}
                      end={{x: 1, y: 1}}>
                      <Icon name="calendar" size={20} color="#FFFFFF" />
                      <Text style={styles.calendarButtonText}>
                        Seleccionar Día de Corte
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  <Portal>
                    <Modal
                      onDismiss={() => setIsVisibleCalendar(false)}
                      visible={isVisibleCalendar}
                      contentContainerStyle={styles.modalContainer}>
                      <View style={styles.calendarCard}>
                        <View style={styles.calendarHeader}>
                          <Icon name="calendar-month" size={24} color="#1C9ADD" />
                          <Text style={styles.calendarTitle}>Día de Corte</Text>
                        </View>
                        <Calendar
                          theme={{
                            textDisabledColor: '#DDD',
                            todayTextColor: '#1C9ADD',
                            selectedDayBackgroundColor: '#1C9ADD',
                            arrowColor: '#1C9ADD',
                          }}
                          style={styles.calendar}
                          markedDates={{
                            [markedDate.date]: markedDate.colors,
                          }}
                          current="2020-03-01"
                          maxDate={
                            calendarControl === 'Month' ? '2020-03-31' : '2020-03-07'
                          }
                          onDayPress={({day, dateString}) => {
                            if (isPriceEditable) {
                              setMarkedDate({
                                colors: {
                                  selected: true,
                                  marked: true,
                                  selectedColor: '#1C9ADD',
                                },
                                date: dateString,
                              });
                              setLimitPay(day);
                              setIsVisibleCalendar(false);
                            }
                          }}
                          renderHeader={() => null}
                          hideArrows={true}
                          hideDayNames={true}
                          hideExtraDays={true}
                        />
                      </View>
                    </Modal>
                  </Portal>

                  <InputCard
                    icon="currency-usd"
                    iconColor="#4CAF50"
                    label="Precio del Equipo/Crédito"
                    placeholder="Ingrese el precio"
                    value={totalPrice}
                    onChangeText={(text) => {
                      if (validateNumber(text)) {
                        setTotalPrice(text);
                      }
                    }}
                    helperText="$"
                    editable={isPriceEditable}
                  />

                  <InputCard
                    icon="clock-outline"
                    iconColor="#FF9800"
                    label="Período de Financiamiento"
                    placeholder="Meses/semanas"
                    value={automaticPay}
                    onChangeText={(text) => {
                      if (validateNumber(text)) {
                        setAutomaticPay(text);
                      }
                    }}
                    helperText="Meses/Semanas"
                    editable={isPriceEditable}
                  />

                  {!isPriceEditable && methodSelected !== 'Comodato' && (
                    <TouchableOpacity
                      style={styles.creditButton}
                      onPress={() => setIncreaseCredit(true)}
                      activeOpacity={0.8}>
                      <LinearGradient
                        style={styles.creditButtonGradient}
                        colors={['#9C27B0', '#7B1FA2']}
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 1}}>
                        <Icon name="trending-up" size={20} color="#FFFFFF" />
                        <Text style={styles.creditButtonText}>Aumento de Crédito</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  )}

                  {increaseCredit && (
                    <InputCard
                      icon="plus-circle"
                      iconColor="#9C27B0"
                      label="Aumento de Crédito"
                      placeholder="Ingrese el monto"
                      value={newCredit}
                      onChangeText={(text) => {
                        if (validateNumber(text)) {
                          setNewCredit(text);
                        }
                      }}
                      helperText="Monto adicional"
                    />
                  )}
                </>
              )}
          </View>
        )}
      </View>

      {/* Mantenimiento Section - Only show if maintenances are available */}
      {maintenances.length > 0 && (
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconContainer, {backgroundColor: '#FFF3E0'}]}>
              <Icon name="wrench" size={20} color="#FF9800" />
            </View>
            <Text style={styles.sectionTitle}>Mantenimiento</Text>
          </View>

          <SwitchRow
            icon="tools"
            iconColor="#FF9800"
            label="Mantenimiento"
            value={isWithMaintenance}
            onValueChange={onWithMaintenance}
          />

          {isWithMaintenance && (
            <View style={styles.maintenanceSection}>
              <View style={styles.pickerCard}>
                <View style={styles.pickerHeader}>
                  <Icon name="cog" size={18} color="#FF9800" />
                  <Text style={styles.pickerLabel}>Método de Mantenimiento</Text>
                </View>
                <View style={styles.pickerContainer}>
                  <Picker
                    style={styles.picker}
                    dropdownIconColor="#FF9800"
                    selectedValue={selectedMaintenances}
                    onValueChange={(itemValue) =>
                      setSelectedMaintenances(itemValue)
                    }>
                    <Picker.Item label="--Seleccionar método--" value="" />
                    {maintenances.map((data: any) => (
                      <Picker.Item
                        key={data._id}
                        label={data.name}
                        value={data._id}
                      />
                    ))}
                  </Picker>
                </View>
              </View>

              {maintenanceArray.length > 0 && (
                <View style={styles.pickerCard}>
                  <View style={styles.pickerHeader}>
                    <Icon name="update" size={18} color="#FF9800" />
                    <Text style={styles.pickerLabel}>Frecuencia</Text>
                  </View>
                  <View style={styles.pickerContainer}>
                    <Picker
                      style={styles.picker}
                      dropdownIconColor="#FF9800"
                      selectedValue={frequencySelectMaintenance}
                      onValueChange={(itemValue) =>
                        setFrequencySelectMaintenance(itemValue)
                      }>
                      <Picker.Item label="--Seleccionar frecuencia--" value="" />
                      {maintenanceArray[0].frequency.map((data: any) => (
                        <Picker.Item key={data} label={data} value={data} />
                      ))}
                    </Picker>
                  </View>
                </View>
              )}
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  sectionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF3E0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  switchRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  switchRowLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  inputCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 14,
    marginTop: 12,
  },
  inputCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  inputIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  inputCardLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
  },
  textInput: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1A1A1A',
  },
  textInputDisabled: {
    backgroundColor: '#F5F5F5',
    color: '#999',
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginTop: 6,
    marginLeft: 4,
  },
  paymentSection: {
    marginTop: 8,
  },
  pickerCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 14,
    marginTop: 12,
  },
  pickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  selectedMethodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 10,
    alignSelf: 'flex-start',
    gap: 6,
  },
  selectedMethodText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2E7D32',
  },
  calendarButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 12,
  },
  calendarButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 10,
  },
  calendarButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  modalContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    width: width * 0.85,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 8},
        shadowOpacity: 0.2,
        shadowRadius: 16,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    gap: 10,
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  calendar: {
    borderRadius: 12,
  },
  creditButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 12,
  },
  creditButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 10,
  },
  creditButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  maintenanceSection: {
    marginTop: 8,
  },
});

export default FormSelects;
