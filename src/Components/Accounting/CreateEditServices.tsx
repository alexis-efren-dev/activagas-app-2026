import React from 'react';
import {Dimensions, Text, View} from 'react-native';
import {Button, Switch} from 'react-native-paper';
import FormSelects from '../RegisterActivation/FormSelects';
import EmergencyActivations from './EmergencyActivations';
const {width, height} = Dimensions.get('screen');
interface Props {
  dataQuery: any;
  services: any;
  maintenances: any;
  isSwitchOn: any;
  onToggleSwitch: any;
  setIsGeneratedServices: any;
  saturday: any;
  onSaturday: any;
  sunday: any;
  onSunday: any;
  withMileage: any;
  onWithMileage: any;
  totalPrice: any;
  setTotalPrice: any;
  automaticPay: any;
  setAutomaticPay: any;
  emergencyActivations: any[];
  setEmergencyActivations: Function;
  allGas: any;
  onAllGas: any;
  setEndDateContract: any;
  endDateContract: any;
  newCredit?: any;
  setNewCredit?: any;
}

const CreateEditServices: React.FC<Props> = ({
  dataQuery,
  services,
  maintenances,
  isSwitchOn,
  onToggleSwitch,
  setIsGeneratedServices,
  saturday,
  sunday,
  onSaturday,
  onSunday,
  withMileage,
  onWithMileage,
  totalPrice,
  setTotalPrice,
  automaticPay,
  setAutomaticPay,
  emergencyActivations,
  setEmergencyActivations,
  allGas,
  onAllGas,
  setEndDateContract,
  endDateContract,
  newCredit,
  setNewCredit,
}) => {
  return (
    <View style={{alignItems: 'center'}}>
      <FormSelects
        newCredit={newCredit}
        setNewCredit={setNewCredit}
        endDateContract={endDateContract}
        setEndDateContract={setEndDateContract}
        isPriceEditable={
          dataQuery.getInfoVehicleToEditResolver.isPriceEditable === '0'
            ? true
            : false
        }
        automaticPay={automaticPay}
        setAutomaticPay={setAutomaticPay}
        setTotalPrice={setTotalPrice}
        totalPrice={totalPrice}
        prevLimitPay={dataQuery.getInfoVehicleToEditResolver.limitPay}
        prevService={dataQuery.getInfoVehicleToEditResolver.service}
        prevCalendar={dataQuery.getInfoVehicleToEditResolver.calendar}
        prevFrequency={dataQuery.getInfoVehicleToEditResolver.frequencySelected}
        prevMaintenance={dataQuery.getInfoVehicleToEditResolver.maintenance}
        prevFrequencyMaintenance={
          dataQuery.getInfoVehicleToEditResolver.frequencySelectMaintenance
        }
        initialLiterPolicy={
          dataQuery.getInfoVehicleToEditResolver.initialLiterPolicy
        }
        initialActivationPolicy={
          dataQuery.getInfoVehicleToEditResolver.initialActivationPolicy
        }
        parsedPolicies={dataQuery.getInfoVehicleToEditResolver.parsedPolicies}
        services={services}
        maintenances={maintenances}
      />
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 20,
        }}>
        <Text>Unidad Verificadora</Text>
        <Switch value={isSwitchOn} onValueChange={onToggleSwitch} color="#1C9ADD" />
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 20,
        }}>
        <Text>Registrar Kilometraje</Text>
        <Switch value={withMileage} onValueChange={onWithMileage} color="#1C9ADD" />
      </View>

      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{fontSize: 20}}>Registro de descansos</Text>

        <Text style={{marginTop: 5}}>Sabado</Text>
        <Switch value={saturday} onValueChange={onSaturday} color="#1C9ADD" />

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
        setEmergencyActivations={setEmergencyActivations}
      />
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
export default CreateEditServices;
