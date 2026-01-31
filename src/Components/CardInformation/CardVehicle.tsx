import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Platform,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux';
import {useMutationDeleteReassignments} from '../../services/Clients/useMutationDeleteReassignments';
import {useMutationUpdateReassignment} from '../../services/Clients/useMutationUpdateReassignment';
import {useQueryGetReassignmentsByPlates} from '../../services/Clients/useQueryGetReassignmentsByPlates';
import {IStore} from '../../redux/store';
import {useQueryClient} from '@tanstack/react-query';

const {width} = Dimensions.get('screen');

interface Props {
  vehicle: any;
}

interface SectionHeaderProps {
  icon: string;
  title: string;
  color: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({icon, title, color}) => (
  <View style={styles.sectionHeader}>
    <View style={[styles.sectionIconContainer, {backgroundColor: color + '20'}]}>
      <Icon name={icon} size={20} color={color} />
    </View>
    <Text style={styles.sectionTitle}>{title}</Text>
  </View>
);

interface InfoRowProps {
  label: string;
  value: string;
}

const InfoRow: React.FC<InfoRowProps> = ({label, value}) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

export const CardVehicle = ({vehicle}: Props) => {
  const [isActivate, setIsActivate] = React.useState<any>(false);
  const {mutate: mutateUpdate, isPending: isLoadingMutationUpdate} =
    useMutationUpdateReassignment();

  const onToggleReassignment = () => {
    if (!isLoadingMutationUpdate) {
      mutateUpdate({
        status: !isActivate,
        _id: data?.getReassignmentByPlatesResolver._id,
        idClient: userRedux._id,
      });
      setIsActivate(!isActivate);
    }
  };

  const userRedux = useSelector((store: IStore) => store.loggedUser);
  const client = useQueryClient();
  const {mutate, isPending: isLoadingMutation} =
    useMutationDeleteReassignments();
  const [dataVariablesReassignment] = React.useState<any>({
    idClient: userRedux._id,
    plates: vehicle.dataVehicle.plates,
  });
  const {data, isError, refetch, isLoading, isFetching} =
    useQueryGetReassignmentsByPlates(dataVariablesReassignment);
  const navigation = useNavigation();
  const parsedPolicies = JSON.parse(vehicle.policies.policies);

  React.useEffect(() => {
    refetch();
  }, [refetch]);

  React.useEffect(() => {
    if (data) {
      setIsActivate(data.getReassignmentByPlatesResolver.status);
    }
  }, [data]);

  if (isError) {
    return (
      <View style={styles.errorContainer}>
        <View style={styles.errorCard}>
          <Icon name="alert-circle-outline" size={48} color="#E53935" />
          <Text style={styles.errorText}>Error de servidor</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}>
      {/* Vehicle Info Section */}
      <View style={styles.card}>
        <SectionHeader icon="car" title="Datos del Vehículo" color="#FF9800" />
        <InfoRow label="Marca" value={vehicle.dataVehicle.brand} />
        <InfoRow label="Modelo" value={vehicle.dataVehicle.model} />
        <InfoRow label="Placas" value={vehicle.dataVehicle.plates} />
      </View>

      {/* Financing Section */}
      <View style={styles.card}>
        <SectionHeader icon="cash-multiple" title="Financiamiento" color="#4CAF50" />
        {vehicle.policies.financing.paymentOptional ? (
          <View style={styles.noBadge}>
            <Icon name="check-circle" size={18} color="#4CAF50" />
            <Text style={styles.noBadgeText}>No financiado</Text>
          </View>
        ) : (
          <>
            <InfoRow label="Tipo" value={vehicle.policies.financing.name} />
            <InfoRow
              label="Meses/Semanas"
              value={vehicle.policies.financing.finalDateToPay}
            />
            <InfoRow
              label="Frecuencia de pago"
              value={vehicle.policies.financing.frequencySelected}
            />
            <InfoRow
              label="Días de corte"
              value={vehicle.policies.financing.limitPay}
            />
            <InfoRow
              label="Costo total"
              value={`$${vehicle.policies.financing.totalOriginalPrice}`}
            />
            <InfoRow
              label="Total abonado"
              value={`$${vehicle.policies.financing.totalPrice}`}
            />
            <InfoRow
              label="Siguiente pago"
              value={vehicle.policies.financing.nextDatePayment}
            />
          </>
        )}
      </View>

      {/* Maintenance Section */}
      <View style={styles.card}>
        <SectionHeader icon="wrench" title="Mantenimiento" color="#2196F3" />
        {vehicle.policies.financing.maintenanceOptional ? (
          <View style={styles.noBadge}>
            <Icon name="information" size={18} color="#9E9E9E" />
            <Text style={styles.noBadgeTextGray}>Sin mantenimiento</Text>
          </View>
        ) : (
          <>
            <InfoRow label="Tipo" value={vehicle.policies.maintenance.name} />
            <InfoRow
              label="Frecuencia"
              value={vehicle.policies.maintenance.frequencySelected}
            />
            <InfoRow
              label="Próximo mantenimiento"
              value={vehicle.policies.maintenance.nextMaintenance}
            />
          </>
        )}
      </View>

      {/* Activation Policies Section */}
      <View style={styles.card}>
        <SectionHeader icon="file-document" title="Políticas de Activación" color="#9C27B0" />
        {parsedPolicies.map((policy: any) => {
          const description =
            policy.method === '0'
              ? `Menor a ${policy.liters} litros → ${policy.activation} hrs`
              : `Mayor a ${policy.liters} litros → ${policy.activation} hrs`;
          return (
            <View key={policy._id} style={styles.policyRow}>
              <Icon name="gas-station" size={16} color="#9C27B0" />
              <Text style={styles.policyText}>{description}</Text>
            </View>
          );
        })}
      </View>

      {/* Verification Section */}
      <View style={styles.card}>
        <SectionHeader icon="shield-check" title="Verificación" color="#00BCD4" />
        {vehicle.policies.verification.isNaturalGas &&
        vehicle.policies.verification.lastVerification !== 'null' ? (
          <InfoRow
            label="Última verificación"
            value={vehicle.policies.verification.lastVerification}
          />
        ) : null}
        <InfoRow
          label="Próxima verificación"
          value={vehicle.policies.verification.nextVerification}
        />
      </View>

      {/* Activation Section */}
      <View style={styles.card}>
        <SectionHeader icon="clock-alert" title="Activación" color="#E91E63" />
        <View style={styles.activationBadge}>
          <Icon name="calendar-clock" size={20} color="#E91E63" />
          <View style={styles.activationContent}>
            <Text style={styles.activationLabel}>Vencimiento</Text>
            <Text style={styles.activationValue}>{vehicle.nextActivation}</Text>
          </View>
        </View>
      </View>

      {/* Reassignment Section */}
      <View style={styles.card}>
        <SectionHeader icon="swap-horizontal" title="Solicitudes de Reasignación" color="#607D8B" />
        {isLoading || isFetching ? (
          <ActivityIndicator size="small" color="#607D8B" />
        ) : data?.getReassignmentByPlatesResolver._id === '' ? (
          <View style={styles.noBadge}>
            <Icon name="check-circle" size={18} color="#4CAF50" />
            <Text style={styles.noBadgeText}>Sin solicitudes pendientes</Text>
          </View>
        ) : (
          <>
            <View style={styles.reassignmentInfo}>
              <Text style={styles.reassignmentLabel}>Gasera solicitante:</Text>
              <Text style={styles.reassignmentValue}>
                {data?.getReassignmentByPlatesResolver.name}
              </Text>
            </View>
            <View style={styles.reassignmentInfo}>
              <Text style={styles.reassignmentLabel}>Fecha de solicitud:</Text>
              <Text style={styles.reassignmentValue}>
                {`${new Date(
                  Number(data?.getReassignmentByPlatesResolver.createdAt),
                ).getUTCDate()}/${
                  new Date(
                    Number(data?.getReassignmentByPlatesResolver.createdAt),
                  ).getUTCMonth() + 1
                }/${new Date(
                  Number(data?.getReassignmentByPlatesResolver.createdAt),
                ).getUTCFullYear()}`}
              </Text>
            </View>

            {/* Actions */}
            <View style={styles.actionsContainer}>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => {
                  if (!isLoadingMutation) {
                    mutate({
                      _id: data?.getReassignmentByPlatesResolver._id,
                      idClient: userRedux._id,
                    });
                  }
                }}
                activeOpacity={0.8}>
                <Icon name="delete" size={20} color="#E53935" />
                <Text style={styles.deleteButtonText}>Eliminar</Text>
              </TouchableOpacity>

              <View style={styles.approvalContainer}>
                <Text style={styles.approvalLabel}>
                  {isActivate ? 'Aprobado' : 'Pendiente'}
                </Text>
                <Switch
                  value={isActivate}
                  onValueChange={onToggleReassignment}
                  trackColor={{false: '#E0E0E0', true: '#A5D6A7'}}
                  thumbColor={isActivate ? '#4CAF50' : '#BDBDBD'}
                />
              </View>
            </View>
          </>
        )}
      </View>

      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => {
          client.removeQueries({queryKey: ['getReassignmentByPlatesResolver']});
          navigation.goBack();
        }}
        activeOpacity={0.8}>
        <Icon name="arrow-left" size={20} color="#FFFFFF" />
        <Text style={styles.backButtonText}>Volver</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: '#E53935',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
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
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  sectionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    flex: 1,
    textAlign: 'right',
  },
  noBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    gap: 8,
  },
  noBadgeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4CAF50',
  },
  noBadgeTextGray: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9E9E9E',
  },
  policyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 10,
  },
  policyText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  activationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FCE4EC',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 12,
  },
  activationContent: {
    flex: 1,
  },
  activationLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  activationValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#E91E63',
  },
  reassignmentInfo: {
    paddingVertical: 8,
  },
  reassignmentLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  reassignmentValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    gap: 6,
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E53935',
  },
  approvalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  approvalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 8,
    gap: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
