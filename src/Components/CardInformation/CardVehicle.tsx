import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Dimensions, ScrollView, StyleSheet, Text, View} from 'react-native';
import {IconButton, Switch, Title} from 'react-native-paper';
import {useSelector} from 'react-redux';
import {useMutationDeleteReassignments} from '../../services/Clients/useMutationDeleteReassignments';
import {useMutationUpdateReassignment} from '../../services/Clients/useMutationUpdateReassignment';
import {useQueryGetReassignmentsByPlates} from '../../services/Clients/useQueryGetReassignmentsByPlates';
import { IStore } from '../../redux/store';
import { useQueryClient } from '@tanstack/react-query';
const {width} = Dimensions.get('screen');
interface Props {
  vehicle: any;
}
export const CardVehicle = ({vehicle}: Props) => {
  const [isActivate, setIsActivate] = React.useState<any>(false);
  const {mutate: mutateUpdate, isPending: isLoadingMutationUpdate} =
    useMutationUpdateReassignment();
  const onWithWhatsapp = () => {
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
  const [dataVariablesReassignment, setDataVariablesReassignment] =
    React.useState<any>({
      idClient: userRedux._id,
      plates: vehicle.dataVehicle.plates,
    });
  const {data, isError, refetch, isLoading, isFetching} =
    useQueryGetReassignmentsByPlates(dataVariablesReassignment);
  const navigation = useNavigation();
  const parsedPolicies = JSON.parse(vehicle.policies.policies);
  React.useEffect(() => {
    refetch();
  }, []);
  React.useEffect(() => {
    if (data) {
      setIsActivate(data.getReassignmentByPlatesResolver.status);
    }
  }, [data]);

  if (isError) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <IconButton icon="water-boiler-alert" iconColor={'black'} size={80} />
        <Title>Error de servidor, intentalo mas tarde</Title>
      </View>
    );
  }
  return (
    <ScrollView style={{marginTop: 20}}>
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <Text style={styles.subTitle}>Marca:</Text>
          <Text>{vehicle.dataVehicle.brand}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.subTitle}>Modelo:</Text>
          <Text>{vehicle.dataVehicle.model}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.subTitle}>Placas:</Text>
          <Text>{vehicle.dataVehicle.plates}</Text>
        </View>
      </View>
      <Text
        style={{
          color: '#ffffff',
          fontSize: 18,
          fontWeight: 'bold',
          marginVertical: 15,
        }}>
        INFORMACION DEL FINANCIAMIENTO
      </Text>
      <View style={styles.cardContainer}>
        {vehicle.policies.financing.paymentOptional ? (
          <View style={styles.card}>
            <Text style={styles.subTitle}>No financiado</Text>
          </View>
        ) : (
          <>
            <View style={styles.card}>
              <Text style={styles.subTitle}>Tipo:</Text>
              <Text>{vehicle.policies.financing.name}</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.subTitle}>Meses/Semanas financiamiento:</Text>
              <Text>{vehicle.policies.financing.finalDateToPay}</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.subTitle}>Frecuencia de pago:</Text>
              <Text>{vehicle.policies.financing.frequencySelected}</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.subTitle}>Dias de corte:</Text>
              <Text>{vehicle.policies.financing.limitPay}</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.subTitle}>Costo total del equipo:</Text>
              <Text>{vehicle.policies.financing.totalOriginalPrice}</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.subTitle}>Total abonado:</Text>
              <Text>{vehicle.policies.financing.totalPrice}</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.subTitle}>Siguiente fecha de pago:</Text>
              <Text>{vehicle.policies.financing.nextDatePayment}</Text>
            </View>
          </>
        )}
      </View>
      <Text
        style={{
          color: '#ffffff',
          fontSize: 18,
          fontWeight: 'bold',
          marginVertical: 15,
        }}>
        INFORMACION DEL MANTENIMIENTO
      </Text>
      {vehicle.policies.financing.maintenanceOptional ? (
        <View style={styles.card}>
          <Text style={styles.subTitle}>
            Este equipo no cuenta con mantenimiento
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.card}>
            <Text style={styles.subTitle}>Tipo:</Text>
            <Text>{vehicle.policies.maintenance.name}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.subTitle}>Meses/Semanas de mantenimiento:</Text>
            <Text>{vehicle.policies.maintenance.frequencySelected}</Text>
          </View>
          <View style={styles.cardContainer}>
            <View style={[styles.card, {alignItems: 'center'}]}>
              <Text style={[styles.subTitle, {flex: 2}]}>
                Siguiente fecha de mantenimiento:
              </Text>
              <Text style={styles.content}>
                {vehicle.policies.maintenance.nextMaintenance}
              </Text>
            </View>
          </View>
        </>
      )}
      <Text
        style={{
          color: '#ffffff',
          fontSize: 18,
          fontWeight: 'bold',
          marginVertical: 15,
        }}>
        POLITICAS DE ACTIVACION
      </Text>
      <View style={styles.cardContainer}>
        {parsedPolicies.map((data: any) => {
          const bodyParsed =
            data.method === '0'
              ? `Menor a ${data.liters} litros la activacion sera de ${data.activation} horas`
              : `Mayor a ${data.liters} litros la activacion sera de ${data.activation} horas`;
          return (
            <View key={data._id} style={styles.card}>
              <Text>{bodyParsed}</Text>
            </View>
          );
        })}
      </View>
      <Text
        style={{
          color: '#ffffff',
          fontSize: 18,
          fontWeight: 'bold',
          marginVertical: 15,
        }}>
        VERIFICACION
      </Text>
      <View style={styles.cardContainer}>
        {vehicle.policies.verification.isNaturalGas ? (
          vehicle.policies.verification.lastVerification === 'null' ? (
            <>
              <View style={styles.card}>
                <Text style={styles.subTitle}>
                  Proxima fecha de verificacion:
                </Text>
                <Text>{vehicle.policies.verification.nextVerification}</Text>
              </View>
            </>
          ) : (
            <>
              <View style={styles.card}>
                <Text style={styles.subTitle}>
                  Ultima fecha de verificacion:
                </Text>
                <Text>{vehicle.policies.verification.lastVerification}</Text>
              </View>

              <View style={styles.card}>
                <Text style={styles.subTitle}>
                  Proxima fecha de verificacion:
                </Text>
                <Text>{vehicle.policies.verification.nextVerification}</Text>
              </View>
            </>
          )
        ) : (
          <View style={styles.card}>
            <Text style={styles.subTitle}>Proxima fecha de verificacion:</Text>
            <Text>{vehicle.policies.verification.nextVerification}</Text>
          </View>
        )}
      </View>
      <Text
        style={{
          color: '#ffffff',
          fontSize: 18,
          fontWeight: 'bold',
          marginVertical: 15,
        }}>
        ACTIVACION
      </Text>
      <View style={styles.cardContainer}>
        <View style={[styles.card, {alignItems: 'center'}]}>
          <Text style={[styles.subTitle, {flex: 2}]}>
            Vencimiento de la activacion:
          </Text>
          <Text style={styles.content}>{vehicle.nextActivation}</Text>
        </View>
      </View>
      <Text
        style={{
          color: '#ffffff',
          fontSize: 18,
          fontWeight: 'bold',
          marginVertical: 15,
        }}>
        SOLICITUDES DE REASIGNACION
      </Text>
      <View style={styles.cardContainer}>
        <View style={[styles.card, {alignItems: 'center'}]}>
          {isLoading || (isFetching && <Text>Cargando</Text>)}

          {!isLoading &&
          !isFetching &&
          data?.getReassignmentByPlatesResolver._id === '' ? (
            <Text style={[styles.subTitle, {flex: 2}]}>Sin solicitudes</Text>
          ) : (
            <Text style={[styles.subTitle, {flex: 1}]}>Una solicitud</Text>
          )}

          {data?.getReassignmentByPlatesResolver._id !== '' && (
            <Text style={styles.content}>
              Solicitud por parte de la gasera:{' '}
              {data?.getReassignmentByPlatesResolver.name}
            </Text>
          )}

          {data?.getReassignmentByPlatesResolver._id !== '' && (
            <Text style={[styles.content, {marginLeft: 10}]}>
              Esta solicitud se creo el dia:{' '}
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
          )}
        </View>
      </View>

      {data?.getReassignmentByPlatesResolver._id !== '' ? (
        <View style={{flexDirection: 'row', marginTop: 5}}>
          <View style={{flex: 1}} />
          <View style={{flex: 1, justifyContent: 'center'}}>
            <Text style={{fontSize: 13, fontWeight: '700'}}>Eliminar</Text>
            <IconButton
              icon="delete"
              iconColor="red"
              size={30}
              onPress={() => {
                if (!isLoadingMutation) {
                  mutate({
                    _id: data?.getReassignmentByPlatesResolver._id,
                    idClient: userRedux._id,
                  });
                }
              }}
            />
          </View>
          <View style={{flex: 1}}>
            <View style={{}}>
              <Text style={{fontSize: 13, fontWeight: '700'}}>
                Desaprobado/Aprobado
              </Text>
            </View>
            <View style={{alignItems: 'flex-start'}}>
              <Switch value={isActivate} onValueChange={onWithWhatsapp} color="#1C9ADD" />
            </View>
          </View>
        </View>
      ) : null}

      <View style={{width: width * 0.9}}>
        <IconButton
          icon="arrow-left-bold"
          iconColor="#1C9ADD"
          size={50}
          onPress={() => {
            client.removeQueries({queryKey:['getReassignmentByPlatesResolver']});
            navigation.goBack();
          }}
        />
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  cardContainer: {
    width: width * 0.9,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 10,
    padding: 5,
    flexDirection: 'row',
    marginVertical: 3,
    flex: 1,
  },
  subTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    marginRight: 5,
  },
  content: {
    flex: 1,
  },
});
