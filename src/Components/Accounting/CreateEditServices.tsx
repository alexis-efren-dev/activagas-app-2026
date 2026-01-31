import React from 'react';
import {
  Dimensions,
  Text,
  View,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Switch,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FormSelects from '../RegisterActivation/FormSelects';
import EmergencyActivations from './EmergencyActivations';

const {width} = Dimensions.get('screen');

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
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerIconContainer}>
          <Icon name="cog-outline" size={28} color="#4CAF50" />
        </View>
        <Text style={styles.headerTitle}>Configurar Servicios</Text>
        <Text style={styles.headerSubtitle}>
          Ajusta los parámetros del vehículo
        </Text>
      </View>

      {/* Form Selects Card */}
      <View style={styles.card}>
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
      </View>

      {/* Options Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Opciones del Vehículo</Text>

        {/* Unidad Verificadora */}
        <View style={styles.switchRow}>
          <View style={styles.switchLabel}>
            <View
              style={[
                styles.switchIcon,
                {backgroundColor: isSwitchOn ? '#E3F2FD' : '#F5F5F5'},
              ]}>
              <Icon
                name="check-decagram"
                size={20}
                color={isSwitchOn ? '#1C9ADD' : '#9E9E9E'}
              />
            </View>
            <Text style={styles.switchText}>Unidad Verificadora</Text>
          </View>
          <Switch
            value={isSwitchOn}
            onValueChange={onToggleSwitch}
            trackColor={{false: '#E0E0E0', true: '#BBDEFB'}}
            thumbColor={isSwitchOn ? '#1C9ADD' : '#BDBDBD'}
          />
        </View>

        {/* Registrar Kilometraje */}
        <View style={styles.switchRow}>
          <View style={styles.switchLabel}>
            <View
              style={[
                styles.switchIcon,
                {backgroundColor: withMileage ? '#E8F5E9' : '#F5F5F5'},
              ]}>
              <Icon
                name="speedometer"
                size={20}
                color={withMileage ? '#4CAF50' : '#9E9E9E'}
              />
            </View>
            <Text style={styles.switchText}>Registrar Kilometraje</Text>
          </View>
          <Switch
            value={withMileage}
            onValueChange={onWithMileage}
            trackColor={{false: '#E0E0E0', true: '#A5D6A7'}}
            thumbColor={withMileage ? '#4CAF50' : '#BDBDBD'}
          />
        </View>
      </View>

      {/* Rest Days Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Icon name="calendar-clock" size={22} color="#FF9800" />
          <Text style={styles.cardTitle}>Días de Descanso</Text>
        </View>

        {/* Sábado */}
        <View style={styles.switchRow}>
          <View style={styles.switchLabel}>
            <View
              style={[
                styles.switchIcon,
                {backgroundColor: saturday ? '#FFF3E0' : '#F5F5F5'},
              ]}>
              <Icon
                name="calendar-weekend"
                size={20}
                color={saturday ? '#FF9800' : '#9E9E9E'}
              />
            </View>
            <Text style={styles.switchText}>Sábado</Text>
          </View>
          <Switch
            value={saturday}
            onValueChange={onSaturday}
            trackColor={{false: '#E0E0E0', true: '#FFCC80'}}
            thumbColor={saturday ? '#FF9800' : '#BDBDBD'}
          />
        </View>

        {/* Domingo */}
        <View style={styles.switchRow}>
          <View style={styles.switchLabel}>
            <View
              style={[
                styles.switchIcon,
                {backgroundColor: sunday ? '#FFF3E0' : '#F5F5F5'},
              ]}>
              <Icon
                name="calendar-weekend-outline"
                size={20}
                color={sunday ? '#FF9800' : '#9E9E9E'}
              />
            </View>
            <Text style={styles.switchText}>Domingo</Text>
          </View>
          <Switch
            value={sunday}
            onValueChange={onSunday}
            trackColor={{false: '#E0E0E0', true: '#FFCC80'}}
            thumbColor={sunday ? '#FF9800' : '#BDBDBD'}
          />
        </View>
      </View>

      {/* Allied Gas Stations Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Icon name="gas-station" size={22} color="#9C27B0" />
          <Text style={styles.cardTitle}>Gaseras Aliadas</Text>
        </View>

        <View style={styles.switchRow}>
          <View style={styles.switchLabel}>
            <View
              style={[
                styles.switchIcon,
                {backgroundColor: allGas ? '#F3E5F5' : '#F5F5F5'},
              ]}>
              <Icon
                name="check-circle"
                size={20}
                color={allGas ? '#9C27B0' : '#9E9E9E'}
              />
            </View>
            <Text style={styles.switchText}>Habilitar Todas</Text>
          </View>
          <Switch
            value={allGas}
            onValueChange={onAllGas}
            trackColor={{false: '#E0E0E0', true: '#CE93D8'}}
            thumbColor={allGas ? '#9C27B0' : '#BDBDBD'}
          />
        </View>
      </View>

      {/* Emergency Activations */}
      <EmergencyActivations
        emergencyActivations={emergencyActivations}
        setEmergencyActivations={setEmergencyActivations}
      />

      {/* Done Button */}
      <TouchableOpacity
        style={styles.doneButton}
        onPress={() => setIsGeneratedServices(false)}
        activeOpacity={0.8}>
        <LinearGradient
          style={styles.doneButtonGradient}
          colors={['#4CAF50', '#388E3C']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}>
          <Icon name="check" size={22} color="#FFFFFF" />
          <Text style={styles.doneButtonText}>Listo</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    width: width - 32,
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  switchLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  switchIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  doneButton: {
    width: width * 0.6,
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#4CAF50',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  doneButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    gap: 10,
  },
  doneButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});

export default CreateEditServices;
