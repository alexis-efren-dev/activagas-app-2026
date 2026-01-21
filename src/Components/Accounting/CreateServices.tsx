import React from 'react';
import {Dimensions, Text, View} from 'react-native';
import {Button, Switch} from 'react-native-paper';
import FormSelects from '../RegisterActivation/FormSelects';
import EmergencyActivations from './EmergencyActivations';
const {width, height} = Dimensions.get('screen');
interface Props {
  services: any;
  maintenances: any;
  isSwitchOn: any;
  onToggleSwitch: any;
  withMileage: any;
  onWithMileage: any;
  setIsGeneratedServices: any;
  automaticPay: any;
  setAutomaticPay: any;
  totalPrice: any;
  setTotalPrice: any;
  saturday: any;
  onSaturday: any;
  sunday: any;
  onSunday: any;
  allGas: any;
  onAllGas: any;
  emergencyActivations: any[];
  setEmergencyActivations: Function;
  endDateContract: any;
  setEndDateContract: any;
}
const CreateServices: React.FC<Props> = ({
  services,
  maintenances,
  isSwitchOn,
  onToggleSwitch,
  withMileage,
  onWithMileage,
  setIsGeneratedServices,
  automaticPay,
  setAutomaticPay,
  setTotalPrice,
  totalPrice,
  saturday,
  sunday,
  onSaturday,
  onSunday,
  emergencyActivations,
  setEmergencyActivations,
  allGas,
  onAllGas,
  endDateContract,
  setEndDateContract,
}) => {
  return (
    <View style={{alignItems: 'center'}}>
      <FormSelects
        endDateContract={endDateContract}
        setEndDateContract={setEndDateContract}
        automaticPay={automaticPay}
        totalPrice={totalPrice}
        setAutomaticPay={setAutomaticPay}
        setTotalPrice={setTotalPrice}
        services={services}
        maintenances={maintenances} />

      <View
        style={{
          width: '70%',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
          flexDirection: 'row',
        }}>
        <Text>Unidad Verificadora</Text>
        <Switch value={isSwitchOn} onValueChange={onToggleSwitch} color="#1C9ADD" />
      </View>

      <View
        style={{
          width: '70%',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
          flexDirection: 'row',
        }}>
        <Text>Registrar Kilometraje</Text>
        <Switch value={withMileage} onValueChange={onWithMileage} color="#1C9ADD" />
      </View>

      <View
        style={{
          marginBottom: 10,
          alignItems: 'flex-start',
        }}>
        <Text style={{color: '#ffffff', fontSize: 18, fontWeight: '500'}}>
          REGISTRO DE DESCANSOS
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
        <Text style={{marginTop: 5}}>Sabado</Text>
        <Switch value={saturday} onValueChange={onSaturday} color="#1C9ADD" />
      </View>

      <View
        style={{
          width: '70%',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
          flexDirection: 'row',
        }}>
        <Text style={{marginTop: 5}}>Domingo</Text>
        <Switch value={sunday} onValueChange={onSunday} color="#1C9ADD" />
      </View>
      <View
        style={{
          marginBottom: 10,
          alignItems: 'flex-start',
        }}>
        <Text style={{color: '#ffffff', fontSize: 18, fontWeight: '500'}}>
          GASERAS ALIADAS
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
        <Text style={{marginTop: 5}}>Habilitar</Text>
        <Switch value={allGas} onValueChange={onAllGas} color="#1C9ADD" />
      </View>

      <EmergencyActivations
        emergencyActivations={emergencyActivations}
        setEmergencyActivations={
          setEmergencyActivations
        } />
      <Button
        style={{
          marginBottom: 20,
          marginTop: 5,
          width: width / 2,
          borderRadius: (width * 0.7) / (height / 36),
        }}
        mode="contained"
        buttonColor="#1C9ADD"
        onPress={() => {
          setIsGeneratedServices(false);
        }}>
        Listo
      </Button>
    </View>
  );
};
export default CreateServices;
