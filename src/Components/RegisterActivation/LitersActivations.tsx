import {Picker} from '@react-native-picker/picker';
import React from 'react';
import {
  Dimensions,
  Text,
  View,
  TextInput,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch} from 'react-redux';
import {getServicesPolicies} from '../../redux/states/servicesSlice';

const {width} = Dimensions.get('screen');

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
    <View style={styles.container}>
      {/* Initial Policy Row */}
      <View style={styles.policyRow}>
        <View style={styles.inputGroup}>
          <View style={styles.inputHeader}>
            <View style={[styles.inputIcon, {backgroundColor: '#FFF3E0'}]}>
              <Icon name="fuel" size={16} color="#FF9800" />
            </View>
            <Text style={styles.inputLabel}>Litros (≤)</Text>
          </View>
          <View style={styles.inputWrapper}>
            <TextInput
              style={[styles.input, disabledInitial() && styles.inputDisabled]}
              value={initialPolicy.liters}
              editable={!disabledInitial()}
              onChangeText={(data: any) => {
                if (data > 0 && data !== '') {
                  setInicialPolicy({...initialPolicy, liters: String(data)});
                } else {
                  setInicialPolicy({...initialPolicy, liters: ''});
                }
              }}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor="#999"
            />
          </View>
        </View>

        <View style={styles.arrowContainer}>
          <Icon name="arrow-right" size={20} color="#1C9ADD" />
        </View>

        <View style={styles.inputGroup}>
          <View style={styles.inputHeader}>
            <View style={[styles.inputIcon, {backgroundColor: '#E3F2FD'}]}>
              <Icon name="clock-outline" size={16} color="#1C9ADD" />
            </View>
            <Text style={styles.inputLabel}>Horas Activ.</Text>
          </View>
          <View style={styles.inputWrapper}>
            <TextInput
              style={[styles.input, disabledInitial() && styles.inputDisabled]}
              value={initialPolicy.activation}
              editable={!disabledInitial()}
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
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor="#999"
            />
          </View>
        </View>
      </View>

      {/* Additional Policies */}
      {addPolicy.length >= 1 && (
        <>
          {addPolicy.map((data: any) => {
            if (data === 0) {
              return null;
            }
            return (
              <View key={data.toString()} style={styles.additionalPolicyCard}>
                <View style={styles.additionalPolicyHeader}>
                  <View style={styles.policyBadge}>
                    <Icon name="plus-circle" size={14} color="#9C27B0" />
                    <Text style={styles.policyBadgeText}>Política {data}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.deleteButton}
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
                    disabled={data + 1 !== unionPolicy.length}>
                    <Icon
                      name="delete"
                      size={20}
                      color={data + 1 !== unionPolicy.length ? '#CCC' : '#E53935'}
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.conditionPickerContainer}>
                  <Text style={styles.conditionLabel}>Condición</Text>
                  <View style={styles.pickerWrapper}>
                    <Picker
                      style={styles.picker}
                      dropdownIconColor="#9C27B0"
                      selectedValue={moreConditions[`data${data}`]?.method || ''}
                      onValueChange={itemValue => {
                        setMoreConditions((state: any) => ({
                          ...state,
                          [`data${data}`]: {
                            ...state[`data${data}`],
                            method: itemValue,
                          },
                        }));
                      }}>
                      <Picker.Item label="--Seleccionar--" value="" />
                      {conditions.map((cond: any) => (
                        <Picker.Item
                          key={cond._id}
                          label={cond.label}
                          value={cond.value}
                        />
                      ))}
                    </Picker>
                  </View>
                </View>

                <View style={styles.policyRow}>
                  <View style={styles.inputGroup}>
                    <View style={styles.inputHeader}>
                      <View style={[styles.inputIcon, {backgroundColor: '#FFF3E0'}]}>
                        <Icon name="fuel" size={16} color="#FF9800" />
                      </View>
                      <Text style={styles.inputLabel}>Litros</Text>
                    </View>
                    <View style={styles.inputWrapper}>
                      <TextInput
                        style={styles.input}
                        value={moreConditions[`data${data}`]?.liters || ''}
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
                        keyboardType="numeric"
                        placeholder="0"
                        placeholderTextColor="#999"
                      />
                    </View>
                  </View>

                  <View style={styles.arrowContainer}>
                    <Icon name="arrow-right" size={20} color="#1C9ADD" />
                  </View>

                  <View style={styles.inputGroup}>
                    <View style={styles.inputHeader}>
                      <View style={[styles.inputIcon, {backgroundColor: '#E3F2FD'}]}>
                        <Icon name="clock-outline" size={16} color="#1C9ADD" />
                      </View>
                      <Text style={styles.inputLabel}>Horas Activ.</Text>
                    </View>
                    <View style={styles.inputWrapper}>
                      <TextInput
                        style={styles.input}
                        value={moreConditions[`data${data}`]?.activation || ''}
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
                        keyboardType="numeric"
                        placeholder="0"
                        placeholderTextColor="#999"
                      />
                    </View>
                  </View>
                </View>
              </View>
            );
          })}
        </>
      )}

      {/* Add Policy Button */}
      {initialPolicy.liters !== '' && initialPolicy.activation !== '' && (
        <TouchableOpacity
          style={styles.addButton}
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
          }}
          activeOpacity={0.8}>
          <LinearGradient
            style={styles.addButtonGradient}
            colors={['#9C27B0', '#7B1FA2']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}>
            <Icon name="plus" size={18} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Agregar Política</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  policyRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  inputGroup: {
    flex: 1,
  },
  inputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  inputIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  inputWrapper: {
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
  },
  input: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  inputDisabled: {
    backgroundColor: '#F0F0F0',
    color: '#999',
  },
  arrowContainer: {
    paddingHorizontal: 12,
    paddingBottom: 14,
  },
  additionalPolicyCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 14,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  additionalPolicyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  policyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3E5F5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
  },
  policyBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9C27B0',
  },
  deleteButton: {
    padding: 4,
  },
  conditionPickerContainer: {
    marginBottom: 12,
  },
  conditionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  pickerWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  addButton: {
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 8,
    alignSelf: 'center',
  },
  addButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    gap: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default LitersActivations;
