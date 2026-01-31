import React from 'react';
import {
  Dimensions,
  Text,
  View,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {Switch} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FormSelects from '../RegisterActivation/FormSelects';
import EmergencyActivations from './EmergencyActivations';

const {width} = Dimensions.get('screen');

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

interface SwitchCardProps {
  icon: string;
  iconColor: string;
  iconBgColor: string;
  label: string;
  description?: string;
  value: boolean;
  onValueChange: () => void;
}

const SwitchCard: React.FC<SwitchCardProps> = ({
  icon,
  iconColor,
  iconBgColor,
  label,
  description,
  value,
  onValueChange,
}) => (
  <View style={styles.switchCard}>
    <View style={styles.switchContent}>
      <View style={[styles.switchIconContainer, {backgroundColor: iconBgColor}]}>
        <Icon name={icon} size={22} color={iconColor} />
      </View>
      <View style={styles.switchTextContainer}>
        <Text style={styles.switchLabel}>{label}</Text>
        {description && (
          <Text style={styles.switchDescription}>{description}</Text>
        )}
      </View>
    </View>
    <Switch value={value} onValueChange={onValueChange} color="#1C9ADD" />
  </View>
);

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
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerIconContainer}>
          <Icon name="cog" size={28} color="#1C9ADD" />
        </View>
        <Text style={styles.headerTitle}>Configurar Servicios</Text>
        <Text style={styles.headerSubtitle}>
          Configura los servicios y opciones del vehículo
        </Text>
      </View>

      {/* Form Selects */}
      <View style={styles.formSelectsContainer}>
        <FormSelects
          endDateContract={endDateContract}
          setEndDateContract={setEndDateContract}
          automaticPay={automaticPay}
          totalPrice={totalPrice}
          setAutomaticPay={setAutomaticPay}
          setTotalPrice={setTotalPrice}
          services={services}
          maintenances={maintenances}
        />
      </View>

      {/* Options Section */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Icon name="tune" size={20} color="#1C9ADD" />
          <Text style={styles.sectionTitle}>Opciones</Text>
        </View>

        <SwitchCard
          icon="check-decagram"
          iconColor="#4CAF50"
          iconBgColor="#E8F5E9"
          label="Unidad Verificadora"
          description="Habilitar verificación de unidad"
          value={isSwitchOn}
          onValueChange={onToggleSwitch}
        />

        <SwitchCard
          icon="speedometer"
          iconColor="#FF9800"
          iconBgColor="#FFF3E0"
          label="Registrar Kilometraje"
          description="Control de kilometraje del vehículo"
          value={withMileage}
          onValueChange={onWithMileage}
        />
      </View>

      {/* Rest Days Section */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Icon name="calendar-weekend" size={20} color="#9C27B0" />
          <Text style={styles.sectionTitle}>Registro de Descansos</Text>
        </View>

        <SwitchCard
          icon="calendar-today"
          iconColor="#9C27B0"
          iconBgColor="#F3E5F5"
          label="Sábado"
          description="Día de descanso"
          value={saturday}
          onValueChange={onSaturday}
        />

        <SwitchCard
          icon="calendar-today"
          iconColor="#9C27B0"
          iconBgColor="#F3E5F5"
          label="Domingo"
          description="Día de descanso"
          value={sunday}
          onValueChange={onSunday}
        />
      </View>

      {/* Allied Gas Stations Section */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Icon name="gas-station" size={20} color="#E91E63" />
          <Text style={styles.sectionTitle}>Gaseras Aliadas</Text>
        </View>

        <SwitchCard
          icon="handshake"
          iconColor="#E91E63"
          iconBgColor="#FCE4EC"
          label="Habilitar"
          description="Permitir carga en gaseras aliadas"
          value={allGas}
          onValueChange={onAllGas}
        />
      </View>

      {/* Emergency Activations */}
      <View style={styles.emergencyContainer}>
        <EmergencyActivations
          emergencyActivations={emergencyActivations}
          setEmergencyActivations={setEmergencyActivations}
        />
      </View>

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
    width: width * 0.9,
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
  formSelectsContainer: {
    width: '100%',
    marginBottom: 16,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    width: '100%',
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
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  switchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  switchContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  switchIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  switchTextContainer: {
    flex: 1,
  },
  switchLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  switchDescription: {
    fontSize: 12,
    color: '#666666',
  },
  emergencyContainer: {
    width: '100%',
    marginBottom: 16,
  },
  doneButton: {
    width: width * 0.6,
    borderRadius: 16,
    overflow: 'hidden',
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
    fontWeight: '600',
  },
});

export default CreateServices;
