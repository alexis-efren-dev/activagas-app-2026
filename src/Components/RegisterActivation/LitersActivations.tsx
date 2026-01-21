import {Picker} from '@react-native-picker/picker';
import React from 'react';
import {Dimensions, Text, View} from 'react-native';
import {Button, IconButton, TextInput} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import {getServicesPolicies} from '../../redux/states/servicesSlice';
const {width, height} = Dimensions.get('screen');
interface IPRops {
  initialLiterPolicy?: any;
  initialActivationPolicy?: any;
  parsedPolicies: any;
}
const LitersActivations: React.FC<IPRops> = ({
  initialLiterPolicy,
  initialActivationPolicy,
  parsedPolicies,
}): JSX.Element => {
  const dispatch = useDispatch();
  const conditions = [
    {
      _id: 1234,
      label: 'Mayor o igual a',
      value: '1',
    },
    {
      _id: 12345,
      label: 'Menor o igual a',
      value: '0',
    },
  ];
  const [initialPolicy, setInicialPolicy] = React.useState<any>({
    liters: initialLiterPolicy || '',
    activation: initialActivationPolicy || '',
    method: '0',
  });
  const [addPolicy, setAddPolicy] = React.useState<any>([0]);
  const verifyPolicies = parsedPolicies ? JSON.parse(parsedPolicies)[0] : false;
  const [moreConditions, setMoreConditions] = React.useState<any>(
    verifyPolicies || {},
  );
  const [unionPolicy, setUnionPolicy] = React.useState<any>([]);
  const disabledInitial = () => {
    return !(addPolicy.length === 1);
  };
  React.useEffect(() => {
    setUnionPolicy([initialPolicy]);
  }, [initialPolicy]);

  React.useEffect(() => {
    const getKeys = Object.keys(moreConditions);

    if (getKeys.length > 0) {
      const newData = [initialPolicy];
      for (let i of getKeys) {
        newData.push(moreConditions[i]);
      }

      setUnionPolicy(newData);
    } else {
      setUnionPolicy([initialPolicy]);
    }
  }, [moreConditions]);

  React.useEffect(() => {
    if (unionPolicy.length <= 1) {
    } else {
      const arrayForPolicies = [];
      for (let i = 0; i < unionPolicy.length; i++) {
        arrayForPolicies.push(i);
      }
      setAddPolicy(arrayForPolicies);
    }
    dispatch(getServicesPolicies(unionPolicy));
  }, [unionPolicy]);
  return (
    <View
      style={{
        marginTop: 80,
        marginBottom: 40,
        alignItems: 'center',
      }}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-evenly',
          width: width,
          height: height / 10,
        }}>
        <View
          style={{
            justifyContent: 'flex-end',
            height: '100%',
          }}>
          <Text style={{fontWeight: '300', width: width / 4, marginBottom: 15}}>
            MENOR O IGUAL A
          </Text>
          <TextInput
            style={{
              width: width / 5,
              borderRadius: (width * 0.7) / (height / 36),
              borderTopRightRadius: (width * 0.7) / (height / 36),
              borderTopLeftRadius: (width * 0.7) / (height / 36),
              elevation: 5,
            }}
            value={initialPolicy.liters}
            disabled={disabledInitial()}
            onChangeText={(data: any) => {
              if (data > 0 && data !== '') {
                setInicialPolicy({...initialPolicy, liters: String(data)});
              } else {
                setInicialPolicy({...initialPolicy, liters: ''});
              }
            }}
            underlineColor="transparent"
            keyboardType={'numeric'}
          />
        </View>
        <View
          style={{
            justifyContent: 'flex-end',
            height: '100%',
          }}>
          <Text style={{width: width / 3, marginBottom: 15}}>
            LAS HORAS DE ACTIVACION SERAN
          </Text>
          <TextInput
            style={{
              width: width / 5,
              borderRadius: (width * 0.7) / (height / 36),
              borderTopRightRadius: (width * 0.7) / (height / 36),
              borderTopLeftRadius: (width * 0.7) / (height / 36),
              elevation: 5,
            }}
            value={initialPolicy.activation}
            disabled={disabledInitial()}
            onChangeText={(data: any) => {
              if (data > 0 && data !== '') {
                setInicialPolicy({
                  ...initialPolicy,
                  activation: String(data),
                });
              } else {
                setInicialPolicy({...initialPolicy, activation: ''});
              }
            }}
            underlineColor="transparent"
            keyboardType={'numeric'}
          />
        </View>
      </View>
      {addPolicy.length >= 1 ? (
        <>
          {addPolicy.map((data: any) => {
            if (data === 0) {
            } else {
              return (
                <View
                  key={data.toString()}
                  style={{
                    alignItems: 'center',
                    marginTop: 15,
                  }}>
                  <Text>SELECCIONAR SI APLICA PARA MENOR O MAYOR QUE</Text>
                  <View
                    style={{
                      width: width,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: height / 7.5,
                      marginBottom: 40,
                      marginTop: 40,
                    }}>
                    <View
                      style={{
                        height: '100%',
                        justifyContent: 'flex-end',
                      }}>
                      <Picker
                        style={{width: width / 3}}
                        selectedValue={moreConditions[`data${data}`].method}
                        onValueChange={itemValue => {
                          setMoreConditions((state: any) => ({
                            ...state,
                            [`data${data}`]: {
                              ...state[`data${data}`],
                              method: itemValue,
                            },
                          }));
                        }}>
                        <Picker.Item label={'--Seleccionar--'} value={''} />
                        {conditions.map((data: any) => (
                          <Picker.Item
                            key={data._id}
                            label={data.label}
                            value={data.value}
                          />
                        ))}
                      </Picker>
                      <TextInput
                        style={{
                          width: width / 5,
                          borderRadius: (width * 0.7) / (height / 36),
                          borderTopRightRadius: (width * 0.7) / (height / 36),
                          borderTopLeftRadius: (width * 0.7) / (height / 36),
                          elevation: 5,
                        }}
                        value={moreConditions[`data${data}`].liters}
                        onChangeText={(dataInput: any) => {
                          if (
                            dataInput > 0 &&
                            dataInput !== '' &&
                            !isNaN(Number(dataInput)) &&
                            !String(dataInput).includes('.')
                          ) {
                            setMoreConditions((state: any) => ({
                              ...state,
                              [`data${data}`]: {
                                ...state[`data${data}`],
                                liters: String(dataInput),
                              },
                            }));
                          } else {
                            setMoreConditions((state: any) => ({
                              ...state,
                              [`data${data}`]: {
                                ...state[`data${data}`],
                                liters: '',
                              },
                            }));
                          }
                        }}
                        underlineColor="transparent"
                        keyboardType={'numeric'}
                      />
                    </View>
                    <View
                      style={{
                        height: '100%',
                        justifyContent: 'flex-end',
                        left: 35,
                      }}>
                      <Text style={{width: width / 3}}>
                        LAS HORAS DE ACTIVACION SERAN
                      </Text>
                      <TextInput
                        style={{
                          width: width / 5,
                          borderRadius: (width * 0.7) / (height / 36),
                          borderTopRightRadius: (width * 0.7) / (height / 36),
                          borderTopLeftRadius: (width * 0.7) / (height / 36),
                          elevation: 5,
                        }}
                        value={moreConditions[`data${data}`].activation}
                        onChangeText={(dataInput: any) => {
                          if (
                            dataInput > 0 &&
                            dataInput !== '' &&
                            !isNaN(Number(dataInput)) &&
                            !String(dataInput).includes('.')
                          ) {
                            setMoreConditions((state: any) => ({
                              ...state,
                              [`data${data}`]: {
                                ...state[`data${data}`],
                                activation: String(dataInput),
                              },
                            }));
                          } else {
                            setMoreConditions((state: any) => ({
                              ...state,
                              [`data${data}`]: {
                                ...state[`data${data}`],
                                activation: '',
                              },
                            }));
                          }
                        }}
                        underlineColor="transparent"
                        keyboardType={'numeric'}
                      />
                    </View>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        left: 35,
                      }}>
                      <IconButton
                        icon="delete"
                        iconColor={'white'}
                        size={20}
                        disabled={data + 1 !== unionPolicy.length}
                        onPress={() => {
                          const oldState = [...addPolicy];
                          const filtered = oldState.filter(
                            dataMap => dataMap !== data,
                          );
                          const oldMoreData = {...moreConditions};
                          delete oldMoreData[`data${data}`];
                          setMoreConditions(oldMoreData);
                          setAddPolicy(filtered);
                        }}
                      />
                    </View>
                  </View>
                </View>
              );
            }
          })}
        </>
      ) : (
        <></>
      )}

      {initialPolicy.liters === '' || initialPolicy.activation === '' ? (
        <></>
      ) : (
        <Button
          color="#ffffff"
          onPress={() => {
            const oldValue = addPolicy[addPolicy.length - 1] + 1;
            setAddPolicy([...addPolicy, oldValue]);

            setMoreConditions({
              ...moreConditions,
              [`data${oldValue}`]: {
                liters: '',
                activation: '',
                method: '1',
              },
            });
          }}>
          Agregar mas politicas
        </Button>
      )}
    </View>
  );
};
export default LitersActivations;
