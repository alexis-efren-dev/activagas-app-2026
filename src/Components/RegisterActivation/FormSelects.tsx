/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {Picker} from '@react-native-picker/picker';
import React, {useState} from 'react';
import {Dimensions, Switch, Text, TextInput, View} from 'react-native';
import {Calendar} from 'react-native-calendars';
import LinearGradient from 'react-native-linear-gradient';
import {Button, HelperText, Modal, Portal} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {validateNumber} from '../../utils/validations';
import LitersActivations from './LitersActivations';
import { getServicesStore } from '../../redux/states/servicesSlice';
import { IStore } from '../../redux/store';
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
  const initStore: any = {
    serviceSelect:
      prevService === '' || !prevService ? services[0]._id : prevService,
    frequencySelect:
      prevFrequency === '' || !prevFrequency ? '0' : prevFrequency,
    maintenanceSelect:
      prevMaintenance === '' || !prevMaintenance
        ? maintenances[0]._id
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
    colors: {selected: true, marked: true, selectedColor: 'blue'},
    date: `2020-03-${
      String(prevLimitPay).length <= 1
        ? '0' + String(prevLimitPay)
        : String(prevLimitPay)
    }`,
  });
  const [isWithPay, setIsWithPay] = React.useState(
    prevService && prevService != services[0]._id,
  );
  const onWithPay = () =>
    setIsWithPay(isPriceEditable ? !isWithPay : isWithPay);
  const [isWithMaintenance, setIsWithMaintenance] = React.useState(
    prevMaintenance && prevMaintenance != maintenances[0]._id,
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
    //resetear los valores de frequency, tanto el id como el otro de el 0 creo
    if (!isWithPay) {
      setSelectedService(services[0]._id);
      setAutomaticPay('0');
      setTotalPrice('0');
      const newServices = {
        ...servicesStore,
        serviceSelect: services[0]._id,
        frequencySelect: '0',
      };
      dispatch(getServicesStore(newServices));
    }
  }, [isWithPay]);

  React.useEffect(() => {
    if (!isWithMaintenance) {
      setSelectedMaintenances(maintenances[0]._id);
      const newServices = {
        ...servicesStore,
        maintenanceSelect: maintenances[0]._id,
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
    <>
      <View
        style={{
          marginBottom: 10,
          alignItems: 'flex-start',
        }}>
        <Text style={{color: '#ffffff', fontSize: 18, fontWeight: '500'}}>
          POLITICAS DE CARGA
        </Text>
      </View>
      <LitersActivations
        initialActivationPolicy={initialActivationPolicy}
        initialLiterPolicy={initialLiterPolicy}
        parsedPolicies={parsedPolicies}
      />
      <View
        style={{
          marginBottom: 10,
          alignItems: 'flex-start',
        }}>
        <Text style={{color: '#ffffff', fontSize: 18, fontWeight: '500'}}>
          POLITICAS ACTIVACION
        </Text>
      </View>

      <View
        style={{
          width: '70%',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
          flexDirection: 'row',
        }}>
        <Text>PAGO</Text>
        <Switch value={isWithPay} onValueChange={onWithPay} color="#1C9ADD" />
      </View>
      {methodSelected === 'Comodato' && !isWithPay ? (
        <View
          style={{
            backgroundColor: 'white',
            width: width * 0.8,
            height: height / 9,
            margin: 8,
            borderRadius: (width * 0.7) / (height / 36),
            elevation: 5,
          }}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              flex: 1,
              justifyContent: 'center',
            }}>
            <TextInput
              editable={isPriceEditable}
              onChangeText={(dataInput: any) => {
                if (validateNumber(dataInput)) {
                  setEndDateContract(dataInput);
                }
              }}
              value={endDateContract}
              keyboardType={'numeric'}
              style={{width: '85%', marginLeft: 5}}
              placeholderTextColor="#000"
              placeholder={'Duracion de contrato en meses'}
            />
            <View
              style={{
                width: 20,
                height: 20,
                aspectRatio: 1 * 1.4,
              }}
            />
          </View>
          <LinearGradient
            style={{
              width: '94%',
              height: 2,
              marginLeft: 7,
              position: 'relative',
              top: -10,
            }}
            colors={['#323F48', '#074169', '#019CDE']}
          />
          <HelperText
            type="info"
            visible={true}
            style={{position: 'relative', top: -10}}>
            Meses
          </HelperText>
        </View>
      ) : null}
      {isWithPay ? (
        <>
          <View
            style={{
              backgroundColor: 'white',
              borderRadius: (width * 0.7) / (height / 36),
              elevation: 5,
              width: width / 1.5,
              height: height / 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Picker
              enabled={isPriceEditable}
              style={{
                width: width / 1.6,

                height: height / 15,
                backgroundColor: 'white',
              }}
              dropdownIconColor="#1C9ADD"
              selectedValue={selectedServices}
              onValueChange={(itemValue, itemIndex) => {
                const splitItem = itemValue.split(',');
                setSelectedService(splitItem[0]);
                setMarkedDate({
                  colors: {selected: true, marked: true, selectedColor: 'blue'},
                  date: '2020-03-01',
                });
                setCalendarControl(splitItem[1]);
                setLimitPay('');
              }}>
              <Picker.Item
                label={'--Seleccionar metodo de financiamiento--'}
                value={''}
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
          <Text>Metodo seleccionado: {methodSelected}</Text>
          {methodSelected === 'Comodato' && (
            <View
              style={{
                backgroundColor: 'white',
                width: width * 0.8,
                height: height / 9,
                margin: 8,
                borderRadius: (width * 0.7) / (height / 36),
                elevation: 5,
              }}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  flex: 1,
                  justifyContent: 'center',
                }}>
                <TextInput
                  editable={isPriceEditable}
                  onChangeText={(dataInput: any) => {
                    if (validateNumber(dataInput)) {
                      setEndDateContract(dataInput);
                    }
                  }}
                  value={endDateContract}
                  keyboardType={'numeric'}
                  style={{width: '85%', marginLeft: 5}}
                  placeholderTextColor="#000"
                  placeholder={'Duracion de contrato en meses'}
                />
                <View
                  style={{
                    width: 20,
                    height: 20,
                    aspectRatio: 1 * 1.4,
                  }}
                />
              </View>
              <LinearGradient
                style={{
                  width: '94%',
                  height: 2,
                  marginLeft: 7,
                  position: 'relative',
                  top: -10,
                }}
                colors={['#323F48', '#074169', '#019CDE']}
              />
              <HelperText
                type="info"
                visible={true}
                style={{position: 'relative', top: -10}}>
                Meses
              </HelperText>
            </View>
          )}
          {calendarControl &&
          methodSelected !== 'Contado' &&
          methodSelected !== 'Comodato' ? (
            <>
              <Button
                style={{marginVertical: 10}}
                mode="contained"
                buttonColor="#1C9ADD"
                onPress={() => {
                  setIsVisibleCalendar(true);
                }}>
                SELECCIONAR DIA DE CORTE
              </Button>
              <Portal>
                <Modal
                  onDismiss={() => setIsVisibleCalendar(false)}
                  visible={isVisibleCalendar}
                  contentContainerStyle={{
                    backgroundColor: 'transparent',
                    alignItems: 'center',
                  }}>
                  <Calendar
                    theme={{
                      textDisabledColor: 'white',
                    }}
                    style={{
                      height: height / 2.4,
                      elevation: 5,
                      width: width / 1.8,
                      borderRadius: (width * 0.7) / (height / 36),
                    }}
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
                            selectedColor: 'blue',
                          },
                          date: dateString,
                        });
                        setLimitPay(day);
                      }
                    }}
                    renderHeader={() => {
                      return <></>;
                    }}
                    hideArrows={true}
                    hideDayNames={true}
                    hideExtraDays={true}
                  />
                </Modal>
              </Portal>

              <View
                style={{
                  backgroundColor: 'white',
                  width: width * 0.8,
                  height: height / 9,
                  margin: 8,
                  borderRadius: (width * 0.7) / (height / 36),
                  elevation: 5,
                }}>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    flex: 1,
                    justifyContent: 'center',
                  }}>
                  <TextInput
                    editable={isPriceEditable}
                    onChangeText={(dataInput: any) => {
                      if (validateNumber(dataInput)) {
                        setTotalPrice(dataInput);
                      }
                    }}
                    value={totalPrice}
                    keyboardType={'numeric'}
                    style={{width: '85%', marginLeft: 5}}
                    placeholderTextColor="#000"
                    placeholder={'Precio del equipo/credito'}
                  />
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      aspectRatio: 1 * 1.4,
                    }}
                  />
                </View>
                <LinearGradient
                  style={{
                    width: '94%',
                    height: 2,
                    marginLeft: 7,
                    position: 'relative',
                    top: -10,
                  }}
                  colors={['#323F48', '#074169', '#019CDE']}
                />
                <HelperText
                  type="info"
                  visible={true}
                  style={{position: 'relative', top: -10}}>
                  {totalPrice !== '' ? 'PRECIO DEL EQUIPO/CREDITO' : '$'}
                </HelperText>
              </View>

              <View
                style={{
                  backgroundColor: 'white',
                  width: width * 0.8,
                  height: height / 9,
                  margin: 8,
                  borderRadius: (width * 0.7) / (height / 36),
                  elevation: 5,
                }}>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    flex: 1,
                    justifyContent: 'center',
                  }}>
                  <TextInput
                    editable={isPriceEditable}
                    value={automaticPay}
                    placeholder="Meses/semanas de financiamiento"
                    onChangeText={(dataInput: any) => {
                      if (validateNumber(dataInput)) {setAutomaticPay(dataInput);}
                    }}
                    keyboardType={'numeric'}
                    style={{width: '85%', marginLeft: 5}}
                    placeholderTextColor="#000"
                  />
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      aspectRatio: 1 * 1.4,
                    }}
                  />
                </View>
                <LinearGradient
                  style={{
                    width: '94%',
                    height: 2,
                    marginLeft: 7,
                    position: 'relative',
                    top: -10,
                  }}
                  colors={['#323F48', '#074169', '#019CDE']}
                />
                <HelperText
                  type="info"
                  visible={true}
                  style={{position: 'relative', top: -10}}>
                  {automaticPay !== ''
                    ? 'MESES/SEMANAS DE FINANCIAMIENTO'
                    : 'N°'}
                </HelperText>
              </View>

              {!isPriceEditable && methodSelected !== 'Comodato' ? (
                <Button
                  style={{marginVertical: 10}}
                  mode="contained"
                  buttonColor="#1C9ADD"
                  onPress={() => {
                    setIncreaseCredit(true);
                  }}>
                  AUMENTO DE CREDITO
                </Button>
              ) : null}

              {increaseCredit && (
                <View
                  style={{
                    backgroundColor: 'white',
                    width: width * 0.8,
                    height: height / 9,
                    margin: 8,
                    borderRadius: (width * 0.7) / (height / 36),
                    elevation: 5,
                  }}>
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      flex: 1,
                      justifyContent: 'center',
                    }}>
                    <TextInput
                      value={newCredit}
                      placeholder="Ingresar el aumento de credito"
                      onChangeText={(dataInput: any) => {
                        if (validateNumber(dataInput)) {setNewCredit(dataInput);}
                      }}
                      keyboardType={'numeric'}
                      style={{width: '85%', marginLeft: 5}}
                      placeholderTextColor="#000"
                    />
                    <View
                      style={{
                        width: 20,
                        height: 20,
                        aspectRatio: 1 * 1.4,
                      }}
                    />
                  </View>
                  <LinearGradient
                    style={{
                      width: '94%',
                      height: 2,
                      marginLeft: 7,
                      position: 'relative',
                      top: -10,
                    }}
                    colors={['#323F48', '#074169', '#019CDE']}
                  />
                  <HelperText
                    type="info"
                    visible={true}
                    style={{position: 'relative', top: -10}}>
                    Aumento de credito
                  </HelperText>
                </View>
              )}
            </>
          ) : null}
        </>
      ) : null}

      <View
        style={{
          width: '70%',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
          flexDirection: 'row',
        }}>
        <Text>MANTENIMIENTO</Text>
        <Switch value={isWithMaintenance} onValueChange={onWithMaintenance} color="#1C9ADD" />
      </View>

      {isWithMaintenance ? (
        <>
          <View
            style={{
              backgroundColor: 'white',
              borderRadius: (width * 0.7) / (height / 36),
              elevation: 5,
              width: width / 1.5,
              height: height / 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Picker
              style={{
                width: width / 1.6,

                height: height / 15,
                backgroundColor: 'white',
              }}
              dropdownIconColor="#1C9ADD"
              selectedValue={selectedMaintenances}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedMaintenances(itemValue)
              }>
              <Picker.Item label={'METODO DE MANTENIMIENTO'} value={''} />
              {maintenances.map((data: any) => (
                <Picker.Item
                  key={data._id}
                  label={data.name}
                  value={data._id}
                />
              ))}
            </Picker>
          </View>

          <View
            style={{
              marginVertical: 20,
              backgroundColor: 'white',
              borderRadius: (width * 0.7) / (height / 36),
              elevation: 5,
              width: width / 1.5,
              height: height / 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {maintenanceArray.length > 0 ? (
              <Picker
                style={{
                  width: width / 1.6,

                  height: height / 15,
                  backgroundColor: 'white',
                }}
                dropdownIconColor="#1C9ADD"
                selectedValue={frequencySelectMaintenance}
                onValueChange={(itemValue, itemIndex) =>
                  setFrequencySelectMaintenance(itemValue)
                }>
                <Picker.Item label={'FRECUENCIA DE MANTENIMIENTO'} value={''} />
                {maintenanceArray[0].frequency.map((data: any) => (
                  <Picker.Item
                    style={{width: 50}}
                    key={data}
                    label={data}
                    value={data}
                  />
                ))}
              </Picker>
            ) : null}
          </View>
        </>
      ) : null}
    </>
  );
};
export default FormSelects;
